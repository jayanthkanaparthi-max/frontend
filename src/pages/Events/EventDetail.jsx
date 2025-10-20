import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { eventService } from '../../services/eventService';
import { registrationService } from '../../services/registrationService';
import { 
  CalendarDaysIcon, 
  MapPinIcon, 
  UsersIcon,
  EyeIcon,
  ClockIcon,
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchEvent();
    if (isAuthenticated) {
      checkRegistrationStatus();
    }
  }, [id, isAuthenticated]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await eventService.getEvent(id);
      setEvent(response.data);
    } catch (err) {
      setError('Failed to fetch event details');
      console.error('Error fetching event:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkRegistrationStatus = async () => {
    try {
      const response = await registrationService.getMyRegistrations();
      const registration = response.data.find(reg => 
        reg.event._id === id && reg.status === 'registered'
      );
      setIsRegistered(!!registration);
    } catch (err) {
      console.error('Error checking registration:', err);
    }
  };

  const handleRegister = async () => {
    if (!isAuthenticated) {
      alert('Please login to register for this event');
      return;
    }

    try {
      setRegistering(true);
      await registrationService.registerForEvent(id);
      setIsRegistered(true);
      alert('Successfully registered for the event!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to register for event';
      alert(errorMessage);
    } finally {
      setRegistering(false);
    }
  };

  const handleCancel = async () => {
    try {
      setCancelling(true);
      await registrationService.cancelRegistration(id);
      setIsRegistered(false);
      alert('Registration cancelled successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to cancel registration';
      alert(errorMessage);
    } finally {
      setCancelling(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      await eventService.deleteEvent(id);
      alert('Event deleted successfully!');
      navigate('/events');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete event';
      alert(errorMessage);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isUpcoming = event && new Date(event.startAt) > new Date();
  const isPast = event && new Date(event.startAt) < new Date();
  const canEdit = user && event && (
    user.role === 'admin' || 
    (user.role === 'organizer' && event.organizer._id === user.id)
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Event not found'}</p>
          <Link
            to="/events"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/events"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Events
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Event Image */}
          <div className="h-64 md:h-96 bg-gray-200 relative">
            {event.image ? (
              <img
                src={`http://localhost:5000/${event.image}`}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                <CalendarDaysIcon className="h-16 w-16 text-white opacity-50" />
              </div>
            )}
            
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              {isPast ? (
                <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Past Event
                </span>
              ) : isUpcoming ? (
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Upcoming
                </span>
              ) : (
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Live Now
                </span>
              )}
            </div>

            {/* Registration Status */}
            {isRegistered && (
              <div className="absolute top-4 left-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Registered
                </span>
              </div>
            )}
          </div>

          {/* Event Content */}
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {event.title}
                </h1>
                <p className="text-lg text-gray-600">
                  {event.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
                {canEdit && (
                  <>
                    <Link
                      to={`/events/${event._id}/edit`}
                      className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                      <PencilIcon className="h-5 w-5 mr-2" />
                      Edit
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      <TrashIcon className="h-5 w-5 mr-2" />
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <ClockIcon className="h-6 w-6 mr-3 text-blue-600" />
                  <div>
                    <div className="font-medium">Start Time</div>
                    <div className="text-gray-600">{formatDate(event.startAt)}</div>
                  </div>
                </div>

                {event.endAt && (
                  <div className="flex items-center text-gray-700">
                    <ClockIcon className="h-6 w-6 mr-3 text-blue-600" />
                    <div>
                      <div className="font-medium">End Time</div>
                      <div className="text-gray-600">{formatDate(event.endAt)}</div>
                    </div>
                  </div>
                )}

                {event.location && (
                  <div className="flex items-center text-gray-700">
                    <MapPinIcon className="h-6 w-6 mr-3 text-blue-600" />
                    <div>
                      <div className="font-medium">Location</div>
                      <div className="text-gray-600">{event.location}</div>
                    </div>
                  </div>
                )}

                {event.capacity && (
                  <div className="flex items-center text-gray-700">
                    <UsersIcon className="h-6 w-6 mr-3 text-blue-600" />
                    <div>
                      <div className="font-medium">Capacity</div>
                      <div className="text-gray-600">{event.capacity} people</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center text-gray-700">
                  <EyeIcon className="h-6 w-6 mr-3 text-blue-600" />
                  <div>
                    <div className="font-medium">Views</div>
                    <div className="text-gray-600">{event.meta?.views || 0}</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Organizer</h3>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        {event.organizer?.name?.charAt(0) || 'O'}
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">
                        {event.organizer?.name || 'Unknown Organizer'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {event.organizer?.email || ''}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Registration Button */}
            {isUpcoming && (
              <div className="border-t pt-6">
                {isRegistered ? (
                  <button
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="w-full sm:w-auto px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cancelling ? 'Cancelling...' : 'Cancel Registration'}
                  </button>
                ) : (
                  <button
                    onClick={handleRegister}
                    disabled={registering}
                    className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {registering ? 'Registering...' : 'Register for Event'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
