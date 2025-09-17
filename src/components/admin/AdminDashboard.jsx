import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Overview from './Overview';
import MemberManagement from './MemberManagement';
import AnnouncementManagement from './AnnouncementManagement';
import EventManagement from './EventManagement';
import CalendarManagement from './CalendarManagement';
import PaymentManagement from './PaymentManagement';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="py-8">
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Navigate to="/admin/overview" replace />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/members" element={<MemberManagement />} />
              <Route path="/announcements" element={<AnnouncementManagement />} />
              <Route path="/events" element={<EventManagement />} />
              <Route path="/calendar" element={<CalendarManagement />} />
              <Route path="/payments" element={<PaymentManagement />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
