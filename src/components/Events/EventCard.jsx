import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarDaysIcon, 
  MapPinIcon, 
  UsersIcon,
  EyeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const EventCard = ({ event, onRegister, onCancel, isRegistered, showActions = true }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isUpcoming = new Date(event.startAt) > new Date();
  const isPast = new Date(event.startAt) < new Date();

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
      {/* Event Image */}
      <div className="h-56 bg-gray-200 relative overflow-hidden">
        {event.image ? (
          <img
            src={`http://localhost:5000/${event.image}`}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
            <CalendarDaysIcon className="h-12 w-12 text-white opacity-70" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          {isPast ? (
            <span className="bg-gray-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
              Past Event
            </span>
          ) : isUpcoming ? (
            <span className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
              Upcoming
            </span>
          ) : (
            <span className="bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
              Live Now
            </span>
          )}
        </div>

        {/* Registration Status */}
        {isRegistered && (
          <div className="absolute top-4 left-4">
            <span className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
              Registered
            </span>
          </div>
        )}
      </div>

      {/* Event Content */}
      <div className="p-8">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-900 line-clamp-2 leading-tight">
            {event.title}
          </h3>
        </div>

        <p className="text-gray-600 text-base mb-6 line-clamp-3 leading-relaxed">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <ClockIcon className="h-4 w-4 text-blue-600" />
            </div>
            <span className="font-medium">{formatDate(event.startAt)}</span>
          </div>

          {event.location && (
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <MapPinIcon className="h-4 w-4 text-green-600" />
              </div>
              <span className="truncate font-medium">{event.location}</span>
            </div>
          )}

          {event.capacity && (
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <UsersIcon className="h-4 w-4 text-purple-600" />
              </div>
              <span className="font-medium">Capacity: {event.capacity} people</span>
            </div>
          )}

          <div className="flex items-center text-sm text-gray-600">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
              <EyeIcon className="h-4 w-4 text-gray-600" />
            </div>
            <span className="font-medium">{event.meta?.views || 0} views</span>
          </div>
        </div>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {event.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm px-3 py-1.5 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
            {event.tags.length > 3 && (
              <span className="inline-block bg-gray-100 text-gray-600 text-sm px-3 py-1.5 rounded-full font-medium">
                +{event.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Organizer */}
        {event.organizer && (
          <div className="text-sm text-gray-500 mb-6">
            Organized by <span className="font-semibold text-gray-700">{event.organizer.name}</span>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex space-x-3">
            <Link
              to={`/events/${event._id}`}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3 px-6 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              View Details
            </Link>
            
            {isUpcoming && (
              <>
                {isRegistered ? (
                  <button
                    onClick={() => onCancel(event._id)}
                    className="flex-1 bg-red-500 text-white py-3 px-6 rounded-xl text-sm font-semibold hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    onClick={() => onRegister(event._id)}
                    className="flex-1 bg-green-500 text-white py-3 px-6 rounded-xl text-sm font-semibold hover:bg-green-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Register
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
