import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { registrationService } from '../../services/registrationService';
import EventCard from '../../components/Events/EventCard';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, upcoming, past, cancelled

  const { user } = useAuth();

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await registrationService.getMyRegistrations();
      setRegistrations(response.data || []);
    } catch (err) {
      setError('Failed to fetch registrations');
      console.error('Error fetching registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (eventId) => {
    try {
      await registrationService.cancelRegistration(eventId);
      setRegistrations(prev => 
        prev.map(reg => 
          reg.event._id === eventId 
            ? { ...reg, status: 'cancelled' }
            : reg
        )
      );
      alert('Registration cancelled successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to cancel registration';
      alert(errorMessage);
    }
  };

  const filteredRegistrations = registrations.filter(registration => {
    const now = new Date();
    const eventDate = new Date(registration.event.startAt);
    
    switch (filter) {
      case 'upcoming':
        return registration.status === 'registered' && eventDate > now;
      case 'past':
        return eventDate <= now;
      case 'cancelled':
        return registration.status === 'cancelled';
      default:
        return true;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'registered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'attended':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your registrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Event Registrations</h1>
          <p className="mt-2 text-gray-600">
            Manage your event registrations and view your event history
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Events' },
              { key: 'upcoming', label: 'Upcoming' },
              { key: 'past', label: 'Past Events' },
              { key: 'cancelled', label: 'Cancelled' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Registrations List */}
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchRegistrations}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="text-center py-12">
            <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No registrations found' : `No ${filter} events`}
            </h3>
            <p className="text-gray-600 mb-4">
              {filter === 'all' 
                ? 'You haven\'t registered for any events yet.' 
                : `You don't have any ${filter} events.`
              }
            </p>
            <Link
              to="/events"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredRegistrations.map((registration) => (
              <div key={registration._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {registration.event.title}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        {registration.event.description}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarDaysIcon className="h-4 w-4 mr-2" />
                        <span>
                          {new Date(registration.event.startAt).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {registration.event.location && (
                          <>
                            <span className="mx-2">•</span>
                            <span>{registration.event.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(registration.status)}`}>
                        {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Link
                      to={`/events/${registration.event._id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Event Details →
                    </Link>
                    
                    {registration.status === 'registered' && new Date(registration.event.startAt) > new Date() && (
                      <button
                        onClick={() => handleCancel(registration.event._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                      >
                        Cancel Registration
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRegistrations;
