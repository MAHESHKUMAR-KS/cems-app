/**
 * Event Service
 * Handles all event-related API calls
 */

import { API_URL } from '@/config/api';

export interface Event {
  _id: string;
  title: string;
  description: string;
  category: 'technical' | 'cultural' | 'sports' | 'workshop';
  date: string;
  time: string;
  registrationDeadline: string;
  venue: string;
  college: string;
  organizer: string;
  image: string;
  capacity: number;
  registrationCount: number;
  registeredUsers: Array<{
    user: string;
    registeredAt: string;
  }>;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetch all events
 */
export const fetchEvents = async (category?: string, search?: string): Promise<Event[]> => {
  try {
    let url = `${API_URL}/events`;
    const params = new URLSearchParams();
    
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.success) {
      return data.data;
    }

    throw new Error(data.message || 'Failed to fetch events');
  } catch (error) {
    console.error('Fetch events error:', error);
    throw error;
  }
};

/**
 * Fetch single event by ID
 */
export const fetchEventById = async (id: string): Promise<Event> => {
  try {
    const response = await fetch(`${API_URL}/events/${id}`);
    const data = await response.json();

    if (data.success) {
      return data.data;
    }

    throw new Error(data.message || 'Failed to fetch event');
  } catch (error) {
    console.error('Fetch event error:', error);
    throw error;
  }
};

/**
 * Create new event
 */
export const createEvent = async (eventData: Partial<Event>): Promise<Event> => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No authentication token found. Please login again.');
    }

    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(eventData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle specific error codes
      if (response.status === 400) {
        throw new Error(data.message || 'Invalid event data. Please check all fields.');
      }
      if (response.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      }
      if (response.status === 403) {
        throw new Error('You do not have permission to create events.');
      }
      throw new Error(data.message || `Server error: ${response.status}`);
    }

    if (data.success) {
      return data.data;
    }

    throw new Error(data.message || 'Failed to create event');
  } catch (error) {
    console.error('Create event error:', error);
    throw error;
  }
};

/**
 * Register for an event
 */
export const registerForEvent = async (eventId: string): Promise<void> => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Please login to register for events.');
    }

    const response = await fetch(`${API_URL}/events/${eventId}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error(data.message || 'Already registered or event is full.');
      }
      if (response.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      }
      throw new Error(data.message || `Registration failed: ${response.status}`);
    }

    if (!data.success) {
      throw new Error(data.message || 'Failed to register for event');
    }
  } catch (error) {
    console.error('Register event error:', error);
    throw error;
  }
};

/**
 * Unregister from an event
 */
export const unregisterFromEvent = async (eventId: string): Promise<void> => {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/events/${eventId}/unregister`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to unregister from event');
    }
  } catch (error) {
    console.error('Unregister event error:', error);
    throw error;
  }
};

/**
 * Update event
 */
export const updateEvent = async (eventId: string, eventData: Partial<Event>): Promise<Event> => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No authentication token found. Please login again.');
    }

    const response = await fetch(`${API_URL}/events/${eventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(eventData),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error(data.message || 'Invalid event data.');
      }
      if (response.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      }
      if (response.status === 403) {
        throw new Error('You do not have permission to edit this event.');
      }
      if (response.status === 404) {
        throw new Error('Event not found.');
      }
      throw new Error(data.message || `Update failed: ${response.status}`);
    }

    if (data.success) {
      return data.data;
    }

    throw new Error(data.message || 'Failed to update event');
  } catch (error) {
    console.error('Update event error:', error);
    throw error;
  }
};

/**
 * Delete event
 */
export const deleteEvent = async (eventId: string): Promise<void> => {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/events/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to delete event');
    }
  } catch (error) {
    console.error('Delete event error:', error);
    throw error;
  }
};
