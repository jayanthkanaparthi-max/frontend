import api from './api';

export const registrationService = {
  // Register for an event
  registerForEvent: async (eventId) => {
    const response = await api.post(`/registrations/${eventId}`);
    return response.data;
  },

  // Cancel registration
  cancelRegistration: async (eventId) => {
    const response = await api.delete(`/registrations/${eventId}`);
    return response.data;
  },

  // Get user's registrations
  getMyRegistrations: async () => {
    const response = await api.get('/registrations');
    return response.data;
  }
};
