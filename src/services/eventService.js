import api from './api';

export const eventService = {
  // Get all events with filters
  getEvents: async (params = {}) => {
    const response = await api.get('/events', { params });
    return response.data;
  },

  // Get single event by ID
  getEvent: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  // Create new event
  createEvent: async (eventData) => {
    const formData = new FormData();
    
    // Append all fields to FormData
    Object.keys(eventData).forEach(key => {
      if (eventData[key] !== null && eventData[key] !== undefined) {
        if (key === 'tags' && Array.isArray(eventData[key])) {
          // Handle tags array
          eventData[key].forEach(tag => formData.append('tags', tag));
        } else if (key === 'startAt' || key === 'endAt') {
          // Handle dates
          formData.append(key, new Date(eventData[key]).toISOString());
        } else {
          formData.append(key, eventData[key]);
        }
      }
    });

    const response = await api.post('/events', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update event
  updateEvent: async (id, eventData) => {
    const formData = new FormData();
    
    // Append all fields to FormData
    Object.keys(eventData).forEach(key => {
      if (eventData[key] !== null && eventData[key] !== undefined) {
        if (key === 'tags' && Array.isArray(eventData[key])) {
          // Handle tags array
          eventData[key].forEach(tag => formData.append('tags', tag));
        } else if (key === 'startAt' || key === 'endAt') {
          // Handle dates
          formData.append(key, new Date(eventData[key]).toISOString());
        } else {
          formData.append(key, eventData[key]);
        }
      }
    });

    const response = await api.put(`/events/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete event
  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  // Get event registrations (for organizers/admins)
  getEventRegistrations: async (id) => {
    const response = await api.get(`/events/${id}/registrations`);
    return response.data;
  }
};
