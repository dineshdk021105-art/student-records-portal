import axios from 'axios';

const API_BASE = (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : '') + '/api/students';

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
  create: async (formData) => {
    const isFormData = formData instanceof FormData;
    const response = await axios.post(API_BASE, formData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },

  // Update existing student
  update: async (id, formData) => {
    const isFormData = formData instanceof FormData;
    const response = await axios.put(`${API_BASE}/${id}`, formData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
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
