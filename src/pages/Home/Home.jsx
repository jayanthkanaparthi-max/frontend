import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  CalendarDaysIcon, 
  UserGroupIcon, 
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: CalendarDaysIcon,
      title: 'Discover Events',
      description: 'Find and explore exciting events happening on campus',
    },
    {
      icon: UserGroupIcon,
      title: 'Connect & Network',
      description: 'Meet like-minded people and build meaningful connections',
    },
    {
      icon: SparklesIcon,
      title: 'Create Events',
      description: 'Organize and host your own events for the community',
    },
  ];

  const stats = [
    { label: 'Active Events', value: '50+' },
    { label: 'Registered Users', value: '1,200+' },
    { label: 'Events Hosted', value: '200+' },
    { label: 'Happy Attendees', value: '5,000+' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Welcome to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Campus Event Hub
              </span>
            </h1>
            <p className="text-xl md:text-3xl mb-12 text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Discover, create, and participate in amazing campus events. 
              Your gateway to enriching experiences and meaningful connections.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/events"
                className="inline-flex items-center px-10 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-200 text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
              >
                Explore Events
                <ArrowRightIcon className="ml-3 h-6 w-6" />
              </Link>
              
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="inline-flex items-center px-10 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-200 text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
                >
                  Join Now
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Campus Event Hub?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide everything you need to discover, create, and participate in campus events
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already discovering amazing events and creating lasting memories.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/events"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-lg"
            >
              Browse Events
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            
            {isAuthenticated ? (
              <Link
                to="/events/create"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors text-lg"
              >
                Create Event
              </Link>
            ) : (
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors text-lg"
              >
                Sign Up Free
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Welcome Message for Authenticated Users */}
      {isAuthenticated && (
        <section className="bg-green-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-2xl font-bold text-green-800 mb-2">
              Welcome back, {user?.name}!
            </h3>
            <p className="text-green-700 mb-6">
              Ready to discover your next great event or create something amazing?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/events"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                View Events
              </Link>
              <Link
                to="/registrations"
                className="inline-flex items-center px-6 py-3 border-2 border-green-600 text-green-600 font-medium rounded-lg hover:bg-green-600 hover:text-white transition-colors"
              >
                My Registrations
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
