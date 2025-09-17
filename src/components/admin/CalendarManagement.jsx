import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import Modal from '../common/Modal';

const CalendarManagement = () => {
  const { events, addEvent, updateEvent } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const openModal = (date, event = null) => {
    setSelectedDate(date);
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setSelectedEvent(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    if (selectedEvent) {
      updateEvent(selectedEvent.id, data);
    } else {
      addEvent({...data, date: selectedDate});
    }
    closeModal();
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'meeting': return 'bg-blue-500';
      case 'volunteer': return 'bg-green-500';
      case 'workshop': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const dateForInput = selectedEvent?.date || selectedDate;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Calendar Management</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{format(currentDate, 'MMMM yyyy')}</h2>
          <div className="flex items-center space-x-2">
            <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 rounded-lg hover:bg-gray-100"><ChevronLeft className="h-5 w-5"/></button>
            <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md">Today</button>
            <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 rounded-lg hover:bg-gray-100"><ChevronRight className="h-5 w-5"/></button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">{day}</div>)}
          
          {monthDays.map(day => {
            const dayEvents = events.filter(event => isSameDay(event.date, day));
            return (
              <div key={day.toString()} className={`min-h-[120px] p-2 border border-gray-100 rounded-lg group relative ${!isSameMonth(day, currentDate) ? 'opacity-50' : ''}`}>
                <div className={`text-sm font-medium ${isSameDay(day, new Date()) ? 'text-blue-600' : ''}`}>{format(day, 'd')}</div>
                <div className="space-y-1 mt-1">
                  {dayEvents.map(event => (
                    <div key={event.id} onClick={() => openModal(day, event)} className={`text-xs p-1 rounded text-white truncate cursor-pointer ${getEventTypeColor(event.type)}`}>{event.title}</div>
                  ))}
                </div>
                <button onClick={() => openModal(day)} className="absolute top-1 right-1 p-1 bg-gray-100 rounded-full text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"><Plus className="h-3 w-3"/></button>
              </div>
            );
          })}
        </div>
      </div>

      <Modal title={selectedEvent ? 'Edit Event' : 'Add Event'} isOpen={isModalOpen} onClose={closeModal}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="title" placeholder="Title" defaultValue={selectedEvent?.title} required className="w-full p-2 border rounded"/>
          <textarea name="description" placeholder="Description" rows="3" defaultValue={selectedEvent?.description} required className="w-full p-2 border rounded"></textarea>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="date" name="date" defaultValue={dateForInput ? format(dateForInput, 'yyyy-MM-dd') : ''} required className="w-full p-2 border rounded"/>
            <input type="time" name="time" defaultValue={selectedEvent?.time} required className="w-full p-2 border rounded"/>
          </div>
          <input type="text" name="location" placeholder="Location" defaultValue={selectedEvent?.location} required className="w-full p-2 border rounded"/>
          <select name="type" defaultValue={selectedEvent?.type} required className="w-full p-2 border rounded">
            <option value="meeting">Meeting</option>
            <option value="volunteer">Volunteer</option>
            <option value="workshop">Workshop</option>
          </select>
          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">{selectedEvent ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CalendarManagement;
