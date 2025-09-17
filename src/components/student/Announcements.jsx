import React from 'react';
import { useData } from '../../contexts/DataContext';
import { Megaphone, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const Announcements = () => {
  const { announcements } = useData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-600 mt-1">Stay updated with the latest news and updates</p>
        </div>
        <div className="flex items-center space-x-2 text-gray-500">
          <Megaphone className="h-5 w-5" />
          <span className="text-sm">{announcements.length} announcements</span>
        </div>
      </div>

      <div className="space-y-4">
        {announcements.map((announcement, index) => (
          <motion.div
            key={announcement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {announcement.title}
                </h2>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{announcement.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(announcement.date, 'MMMM dd, yyyy')}</span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Megaphone className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{announcement.content}</p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                Organization Announcement
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {announcements.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Megaphone className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements yet</h3>
          <p className="text-gray-500">Check back later for updates from your organization.</p>
        </motion.div>
      )}
    </div>
  );
};

export default Announcements;
