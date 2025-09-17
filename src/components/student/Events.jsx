import React from 'react';
import { useData } from '../../contexts/DataContext';
import { Calendar, Clock, MapPin, Users, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const Events = () => {
  const { events } = useData();

  const upcomingEvents = events
    .filter(event => event.date >= new Date())
    .sort((a, b) => a.date - b.date);

  const pastEvents = events
    .filter(event => event.date < new Date())
    .sort((a, b) => b.date - a.date);

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'volunteer':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'workshop':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'meeting':
        return Users;
      case 'volunteer':
        return Users;
      case 'workshop':
        return Users;
      default:
        return Calendar;
    }
  };

  const EventCard = ({ event, index, isPast = false }) => {
    const Icon = getEventIcon(event.type);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow ${
          isPast ? 'opacity-75' : ''
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
              <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getEventTypeColor(event.type)}`}>
                <Tag className="h-3 w-3 mr-1" />
                {event.type}
              </span>
            </div>
            <p className="text-gray-600 mb-3">{event.description}</p>
          </div>
          <div className="flex-shrink-0">
            <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
              isPast ? 'bg-gray-100' : 'bg-blue-100'
            }`}>
              <Icon className={`h-6 w-6 ${isPast ? 'text-gray-500' : 'text-blue-600'}`} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span>{format(event.date, 'EEEE, MMMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2 text-gray-400" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            <span>{event.location}</span>
          </div>
        </div>

        {!isPast && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Mark as Interested
            </button>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600 mt-1">Discover upcoming events and activities</p>
        </div>
        <div className="flex items-center space-x-2 text-gray-500">
          <Calendar className="h-5 w-5" />
          <span className="text-sm">{events.length} events</span>
        </div>
      </div>

      {/* Upcoming Events */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-blue-600" />
          Upcoming Events ({upcomingEvents.length})
        </h2>
        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcomingEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white rounded-xl border border-gray-200">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming events</h3>
            <p className="text-gray-500">Check back later for new events.</p>
          </div>
        )}
      </div>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-gray-600" />
            Past Events ({pastEvents.length})
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pastEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} isPast={true} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
