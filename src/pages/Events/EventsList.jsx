import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { eventService } from '../../services/eventService';
import { registrationService } from '../../services/registrationService';
import EventCard from '../../components/Events/EventCard';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  PlusIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    upcoming: false,
    tags: '',
    organizer: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  });
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [registering, setRegistering] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    fetchEvents();
    if (isAuthenticated) {
      fetchMyRegistrations();
    }
  }, [isAuthenticated, searchTerm, filters, pagination.currentPage]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        size: pagination.itemsPerPage,
        q: searchTerm || undefined,
        upcoming: filters.upcoming ? 'true' : undefined,
        tags: filters.tags || undefined,
        organizer: filters.organizer || undefined,
      };

      // Remove undefined values
      Object.keys(params).forEach(key => {
        if (params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await eventService.getEvents(params);
      setEvents(response.data || []);
      setPagination(prev => ({
        ...prev,
        totalPages: response.totalPages || 1,
        totalItems: response.totalItems || 0
      }));
    } catch (err) {
      setError('Failed to fetch events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRegistrations = async () => {
    try {
      const response = await registrationService.getMyRegistrations();
      const registrationMap = {};
      response.data.forEach(reg => {
        if (reg.status === 'registered') {
          registrationMap[reg.event._id] = true;
        }
      });
      setMyRegistrations(registrationMap);
    } catch (err) {
      console.error('Error fetching registrations:', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchEvents();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleRegister = async (eventId) => {
    if (!isAuthenticated) {
      alert('Please login to register for events');
      return;
    }

    try {
      setRegistering(eventId);
      await registrationService.registerForEvent(eventId);
      setMyRegistrations(prev => ({ ...prev, [eventId]: true }));
      alert('Successfully registered for the event!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to register for event';
      alert(errorMessage);
    } finally {
      setRegistering(null);
    }
  };

  const handleCancel = async (eventId) => {
    try {
      setCancelling(eventId);
      await registrationService.cancelRegistration(eventId);
      setMyRegistrations(prev => {
        const newRegistrations = { ...prev };
        delete newRegistrations[eventId];
        return newRegistrations;
      });
      alert('Registration cancelled successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to cancel registration';
      alert(errorMessage);
    } finally {
      setCancelling(null);
    }
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Campus Events</h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Discover and join amazing events happening on campus
              </p>
            </div>
            
            {(user?.role === 'organizer' || user?.role === 'admin') && (
              <Link
                to="/events/create"
                className="mt-6 sm:mt-0 inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
              >
                <PlusIcon className="h-6 w-6 mr-3" />
                Create Event
              </Link>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-100">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-medium"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                Search
              </button>
            </div>

            <div className="flex flex-wrap gap-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.upcoming}
                  onChange={(e) => handleFilterChange('upcoming', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                />
                <span className="ml-3 text-lg font-medium text-gray-700">Upcoming only</span>
              </label>
            </div>
          </form>
        </div>

        {/* Events Grid */}
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchEvents}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filters.upcoming 
                ? 'Try adjusting your search criteria' 
                : 'Be the first to create an event!'
              }
            </p>
            {(user?.role === 'organizer' || user?.role === 'admin') && (
              <Link
                to="/events/create"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create First Event
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onRegister={handleRegister}
                  onCancel={handleCancel}
                  isRegistered={myRegistrations[event._id]}
                  showActions={true}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {[...Array(pagination.totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        pagination.currentPage === index + 1
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EventsList;
