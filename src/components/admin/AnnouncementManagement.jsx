import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Megaphone, Plus, Edit, Trash2 } from 'lucide-react';
import Modal from '../common/Modal';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AnnouncementManagement = () => {
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useData();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);

  const openModal = (announcement = null) => {
    setCurrentAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentAnnouncement(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    const promise = currentAnnouncement 
      ? updateAnnouncement(currentAnnouncement.id, data)
      : addAnnouncement({ ...data, author: user.name });

    toast.promise(promise, {
      loading: `${currentAnnouncement ? 'Updating' : 'Posting'} announcement...`,
      success: `Announcement ${currentAnnouncement ? 'updated' : 'posted'} successfully!`,
      error: `Failed to ${currentAnnouncement ? 'update' : 'post'} announcement.`,
    });
    
    closeModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      const promise = deleteAnnouncement(id);
      toast.promise(promise, {
        loading: 'Deleting announcement...',
        success: 'Announcement deleted successfully!',
        error: 'Failed to delete announcement.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Announcement Management</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Announcement
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((ann, index) => (
          <motion.div
            key={ann.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{ann.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{format(ann.date, 'MMMM dd, yyyy')}</p>
                <p className="text-gray-700 mt-3">{ann.content}</p>
              </div>
              <div className="flex space-x-2 flex-shrink-0 ml-4">
                <button onClick={() => openModal(ann)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-md"><Edit className="h-4 w-4"/></button>
                <button onClick={() => handleDelete(ann.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-md"><Trash2 className="h-4 w-4"/></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal title={currentAnnouncement ? 'Edit Announcement' : 'New Announcement'} isOpen={isModalOpen} onClose={closeModal}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="title" placeholder="Title" defaultValue={currentAnnouncement?.title} required className="w-full p-2 border rounded"/>
          <textarea name="content" placeholder="Content" rows="5" defaultValue={currentAnnouncement?.content} required className="w-full p-2 border rounded"></textarea>
          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">{currentAnnouncement ? 'Update' : 'Post'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AnnouncementManagement;
