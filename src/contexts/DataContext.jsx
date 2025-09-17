import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from './AuthContext';
import { keysToCamel, keysToSnake } from '../utils/dataConversion';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

const enrichPayment = (payment) => ({
  ...payment,
  date: new Date(payment.createdAt),
  studentName: payment.profile?.name || 'Unknown',
  studentId: payment.profile?.studentId || 'N/A'
});

export const DataProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [payments, setPayments] = useState([]);

  const fetchData = async () => {
    if (!user) {
      setAnnouncements([]);
      setEvents([]);
      setMembers([]);
      setPayments([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [
        announcementsRes,
        eventsRes,
        membersRes,
        paymentsRes
      ] = await Promise.all([
        supabase.from('announcements').select('*').order('created_at', { ascending: false }),
        supabase.from('events').select('*').order('date', { ascending: true }),
        supabase.from('profiles').select('*').order('name', { ascending: true }),
        supabase.from('payments').select('*, profile:profiles(name, student_id)').order('created_at', { ascending: false })
      ]);

      if (announcementsRes.error) throw announcementsRes.error;
      if (eventsRes.error) throw eventsRes.error;
      if (membersRes.error) throw membersRes.error;
      if (paymentsRes.error) throw paymentsRes.error;

      const camelAnnouncements = keysToCamel(announcementsRes.data);
      const camelEvents = keysToCamel(eventsRes.data);
      const camelMembers = keysToCamel(membersRes.data);
      const camelPayments = keysToCamel(paymentsRes.data);

      setAnnouncements(camelAnnouncements.map(a => ({...a, date: new Date(a.createdAt)})));
      setEvents(camelEvents.map(e => ({...e, date: new Date(e.date)})));
      setMembers(camelMembers.map(m => ({...m, membershipExpiry: m.membershipExpiry ? new Date(m.membershipExpiry) : null })));
      setPayments(camelPayments.map(enrichPayment));

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchData();
    }
  }, [user, authLoading]);

  // --- REFACTORED CRUD FUNCTIONS ---

  const addAnnouncement = async (announcement) => {
    const { data, error } = await supabase.from('announcements').insert(keysToSnake(announcement)).select().single();
    if (error) throw error;
    const newAnnouncement = {...keysToCamel(data), date: new Date(data.created_at)};
    setAnnouncements(prev => [newAnnouncement, ...prev]);
  };

  const updateAnnouncement = async (id, updatedAnnouncement) => {
    const { data, error } = await supabase.from('announcements').update(keysToSnake(updatedAnnouncement)).eq('id', id).select().single();
    if (error) throw error;
    const newAnnouncement = {...keysToCamel(data), date: new Date(data.created_at)};
    setAnnouncements(prev => prev.map(a => a.id === id ? newAnnouncement : a));
  };

  const deleteAnnouncement = async (id) => {
    const { error } = await supabase.from('announcements').delete().eq('id', id);
    if (error) throw error;
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  const addEvent = async (event) => {
    const { data, error } = await supabase.from('events').insert(keysToSnake(event)).select().single();
    if (error) throw error;
    const newEvent = {...keysToCamel(data), date: new Date(data.date)};
    setEvents(prev => [...prev, newEvent].sort((a, b) => a.date - b.date));
  };

  const updateEvent = async (id, updatedEvent) => {
    const { data, error } = await supabase.from('events').update(keysToSnake(updatedEvent)).eq('id', id).select().single();
    if (error) throw error;
    const newEvent = {...keysToCamel(data), date: new Date(data.date)};
    setEvents(prev => prev.map(e => e.id === id ? newEvent : e).sort((a, b) => a.date - b.date));
  };

  const deleteEvent = async (id) => {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw error;
    setEvents(prev => prev.filter(e => e.id !== id));
  };
  
  const updateMember = async (id, updatedMember) => {
    const { data, error } = await supabase.from('profiles').update(keysToSnake(updatedMember)).eq('id', id).select().single();
    if (error) throw error;
    const newMember = {...keysToCamel(data), membershipExpiry: data.membership_expiry ? new Date(data.membership_expiry) : null};
    setMembers(prev => prev.map(m => m.id === id ? newMember : m).sort((a,b) => a.name.localeCompare(b.name)));
  };
  
  const deleteMember = async (id) => {
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) {
      console.error("Error deleting profile:", error);
      throw error;
    }
    setMembers(prev => prev.filter(m => m.id !== id));
    console.warn("User profile deleted. The auth user record still exists in Supabase Auth but can no longer log in to a profile.");
  };

  const addPayment = async (payment) => {
    const { data, error } = await supabase.from('payments').insert(keysToSnake(payment)).select('*, profile:profiles(name, student_id)').single();
    if (error) throw error;
    const newPayment = enrichPayment(keysToCamel(data));
    setPayments(prev => [newPayment, ...prev]);
  };

  const updatePayment = async (id, updatedPayment) => {
    const { data, error } = await supabase.from('payments').update(keysToSnake(updatedPayment)).eq('id', id).select('*, profile:profiles(name, student_id)').single();
    if (error) throw error;
    const newPayment = enrichPayment(keysToCamel(data));
    setPayments(prev => prev.map(p => p.id === id ? newPayment : p));
  };

  const value = {
    loading,
    announcements,
    events,
    members,
    payments,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    addEvent,
    updateEvent,
    deleteEvent,
    updateMember,
    deleteMember,
    addPayment,
    updatePayment,
    refetchData: fetchData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
