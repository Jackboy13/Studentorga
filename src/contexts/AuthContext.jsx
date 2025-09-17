import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { keysToSnake, keysToCamel } from '../utils/dataConversion';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const getProfileWithRetry = async (userId, retries = 3, delay = 500) => {
  for (let i = 0; i < retries; i++) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error && error.code !== 'PGRST116') { // PGRST116: "exact one row expected"
      console.error("Error fetching profile:", error);
    }
    if (profile) return profile;
    await new Promise(res => setTimeout(res, delay));
  }
  console.warn(`Profile for user ${userId} not found after ${retries} retries.`);
  return null;
};


const getUserFromSession = async (session) => {
  if (!session) return null;

  let profile = await getProfileWithRetry(session.user.id);

  // FOOLPROOF ADMIN CHECK: If the email is the admin's, guarantee the 'admin' role.
  if (session.user.email.toLowerCase() === 'admin@org.com') {
    // Self-heal: If admin profile doesn't exist, create it.
    if (!profile) {
      console.log("Admin logged in without a profile. Creating one now...");
      const { data: newAdminProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: session.user.id,
          name: 'Admin',
          email: session.user.email,
          role: 'admin',
          student_id: 'ADMIN',
          course: 'System',
          year: 'N/A',
          organization: 'Core Team',
          membership_paid: true,
          membership_expiry: '2099-12-31'
        })
        .select()
        .single();

      if (createError) {
        console.error("Failed to auto-create admin profile:", createError);
        // Fallback to a temporary object if creation fails, to prevent being locked out.
        return { ...session.user, role: 'admin', name: 'Admin (Fallback)' };
      }
      profile = newAdminProfile;
    }
    // Unconditionally return the user object with the 'admin' role, overwriting any role from the profile.
    return { ...session.user, ...keysToCamel(profile), role: 'admin' };
  }
  
  // Logic for regular student users
  if (profile) {
    return { ...session.user, ...keysToCamel(profile) };
  }
  
  // Fallback for a new student user if profile is still not found after retries
  const meta = session.user.user_metadata;
  if (meta && meta.role) {
     return { ...session.user, ...keysToCamel(meta) };
  }

  console.error("Authenticated user has no profile or role metadata:", session.user.id);
  // Return a minimal user object to prevent logout loop
  return { ...session.user, role: 'student', name: 'New User' };
};


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const fullUser = await getUserFromSession(session);
      setUser(fullUser);
      setLoading(false);
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // Use a timeout to defer the async operation, preventing deadlocks
        setTimeout(async () => {
          setLoading(true);
          const fullUser = await getUserFromSession(session);
          setUser(fullUser);
          setLoading(false);
        }, 0);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const register = async (userData) => {
    const { email, password, ...profileData } = userData;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          ...keysToSnake(profileData),
          role: 'student',
        },
      },
    });
    if (error) throw error;
    return data;
  };

  const value = {
    user,
    login,
    logout,
    register,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
