import axios from 'axios';
import { API_URL } from '@/config/api';

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  issueType: string;
  subject: string;
  message: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'closed';
  response?: string;
  respondedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  respondedAt?: string;
  userId?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ContactStats {
  total: number;
  byStatus: {
    pending: number;
    inProgress: number;
    resolved: number;
    closed: number;
  };
  byIssueType: Record<string, number>;
}

// Submit contact message (public)
export const submitContactMessage = async (data: {
  name: string;
  email: string;
  issueType: string;
  subject: string;
  message: string;
}): Promise<ContactMessage> => {
  try {
    const response = await axios.post(`${API_URL}/contact`, data);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to submit contact message');
  }
};

// Get all contact messages (admin only)
export const fetchContactMessages = async (params?: {
  status?: string;
  limit?: number;
  page?: number;
}): Promise<{
  data: ContactMessage[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/contact`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch contact messages');
  }
};


export const fetchContactById = async (id: string): Promise<ContactMessage> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/contact/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch contact message');
  }
};

// Update contact message (admin only)
export const updateContactMessage = async (
  id: string,
  data: {
    status?: string;
    response?: string;
  }
): Promise<ContactMessage> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/contact/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update contact message');
  }
};

// Delete contact message (admin only)
export const deleteContactMessage = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/contact/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete contact message');
  }
};

// Get contact statistics (admin only)
export const fetchContactStats = async (): Promise<ContactStats> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/contact/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch contact statistics');
  }
};
