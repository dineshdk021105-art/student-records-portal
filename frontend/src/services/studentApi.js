import axios from 'axios';

// Get base URL from environment or default to http://localhost:5000
const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_BASE = `${rawApiUrl.replace(/\/$/, '')}/api/students`;

export const studentApi = {
  // Fetch paginated students with search and department filtering
  getAll: async ({ search = '', department = '', page = 1, limit = 4 } = {}) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (department && department !== 'All Departments') params.append('department', department);
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);

    const response = await axios.get(`${API_BASE}?${params.toString()}`);
    return response.data;
  },

  // Fetch aggregate dashboard metrics
  getStats: async () => {
    const response = await axios.get(`${API_BASE}/stats`);
    return response.data;
  },

  // Get single student record
  getById: async (id) => {
    const response = await axios.get(`${API_BASE}/${id}`);
    return response.data;
  },

  // Create a new student (supports multipart FormData for photo file upload or JSON)
  create: async (data) => {
    const isFormData = data instanceof FormData;
    const response = await axios.post(API_BASE, data, {
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  // Update existing student
  update: async (id, data) => {
    const isFormData = data instanceof FormData;
    const response = await axios.put(`${API_BASE}/${id}`, data, {
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  // Delete student
  delete: async (id) => {
    const response = await axios.delete(`${API_BASE}/${id}`);
    return response.data;
  },
};

export default studentApi;
