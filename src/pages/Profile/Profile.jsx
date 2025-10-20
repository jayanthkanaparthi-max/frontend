import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { UserIcon, EnvelopeIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const Profile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await authService.getProfile();
      setProfile(response.data);
    } catch (err) {
      setError('Failed to fetch profile');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'organizer':
        return 'bg-blue-100 text-blue-800';
      case 'student':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return '👑';
      case 'organizer':
        return '🎯';
      case 'student':
        return '🎓';
      default:
        return '👤';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-2 text-gray-600">Manage your account information and preferences</p>
        </div>

        {error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchProfile}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-start space-x-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserIcon className="h-12 w-12 text-blue-600" />
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {profile?.name || user?.name || 'Unknown User'}
                    </h2>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(profile?.role || user?.role)}`}>
                      <span className="mr-1">{getRoleIcon(profile?.role || user?.role)}</span>
                      {(profile?.role || user?.role)?.charAt(0).toUpperCase() + (profile?.role || user?.role)?.slice(1)}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <EnvelopeIcon className="h-5 w-5 mr-3" />
                      <span>{profile?.email || user?.email || 'No email provided'}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <ShieldCheckIcon className="h-5 w-5 mr-3" />
                      <span>Member since {new Date(profile?.createdAt || user?.createdAt || Date.now()).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Sign Out</h4>
                    <p className="text-sm text-gray-600">Sign out of your account</p>
                  </div>
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>

            {/* Role Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Information</h3>
              <div className="space-y-3">
                {(profile?.role || user?.role) === 'student' && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Student Account</h4>
                    <p className="text-sm text-green-700">
                      As a student, you can browse and register for events, view your registration history, 
                      and connect with other students.
                    </p>
                  </div>
                )}
                
                {(profile?.role || user?.role) === 'organizer' && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Event Organizer</h4>
                    <p className="text-sm text-blue-700">
                      As an organizer, you can create and manage events, view registration details, 
                      and track event performance.
                    </p>
                  </div>
                )}
                
                {(profile?.role || user?.role) === 'admin' && (
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-medium text-red-900 mb-2">Administrator</h4>
                    <p className="text-sm text-red-700">
                      As an admin, you have full access to manage all events, users, and system settings.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">0</div>
                <div className="text-gray-600">Events Created</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">0</div>
                <div className="text-gray-600">Events Attended</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">0</div>
                <div className="text-gray-600">Total Registrations</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
