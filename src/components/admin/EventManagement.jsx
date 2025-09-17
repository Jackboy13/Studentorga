import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Calendar, Plus, Edit, Trash2 } from 'lucide-react';
import Modal from '../common/Modal';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const EventManagement = () => {
  const { events, addEvent, updateEvent, deleteEvent } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  const openModal = (event = null) => {
    setCurrentEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentEvent(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    const promise = currentEvent
      ? updateEvent(currentEvent.id, data)
      : addEvent(data);

    toast.promise(promise, {
      loading: `${currentEvent ? 'Updating' : 'Creating'} event...`,
      success: `Event ${currentEvent ? 'updated' : 'created'} successfully!`,
      error: `Failed to ${currentEvent ? 'update' : 'create'} event.`,
    });

    closeModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const promise = deleteEvent(id);
      toast.promise(promise, {
        loading: 'Deleting event...',
        success: 'Event deleted successfully!',
        error: 'Failed to delete event.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white p-6 rounded-xl shadow-sm border"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{event.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{format(event.date, 'MMMM dd, yyyy')} at {event.time}</p>
                <p className="text-sm text-gray-500">{event.location}</p>
                <p className="text-gray-700 mt-3">{event.description}</p>
              </div>
              <div className="flex flex-col space-y-2 flex-shrink-0 ml-4">
                <button onClick={() => openModal(event)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-md"><Edit className="h-4 w-4"/></button>
                <button onClick={() => handleDelete(event.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-md"><Trash2 className="h-4 w-4"/></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal title={currentEvent ? 'Edit Event' : 'New Event'} isOpen={isModalOpen} onClose={closeModal}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="title" placeholder="Title" defaultValue={currentEvent?.title} required className="w-full p-2 border rounded"/>
          <textarea name="description" placeholder="Description" rows="3" defaultValue={currentEvent?.description} required className="w-full p-2 border rounded"></textarea>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="date" name="date" defaultValue={currentEvent ? format(currentEvent.date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')} required className="w-full p-2 border rounded"/>
            <input type="time" name="time" defaultValue={currentEvent?.time} required className="w-full p-2 border rounded"/>
          </div>
          <input type="text" name="location" placeholder="Location" defaultValue={currentEvent?.location} required className="w-full p-2 border rounded"/>
          <select name="type" defaultValue={currentEvent?.type || 'meeting'} required className="w-full p-2 border rounded">
            <option value="meeting">Meeting</option>
            <option value="volunteer">Volunteer</option>
            <option value="workshop">Workshop</option>
          </select>
          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">{currentEvent ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EventManagement;
