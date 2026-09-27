import axios from 'axios';

// Get base URL from environment or default to http://localhost:5000
export const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, '');
  }
  return 'http://localhost:5000';
};

const baseUrl = getApiBaseUrl();

// Construct base endpoint cleanly, avoiding duplicate /api
export const API_BASE = baseUrl.endsWith('/api/students')
  ? baseUrl
  : baseUrl.endsWith('/api')
  ? `${baseUrl}/students`
  : `${baseUrl}/api/students`;

// Helper to resolve image URLs (handles local uploads, cloud backend, and external URLs)
export const resolveImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const cleanBase = getApiBaseUrl();
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${cleanBase}${cleanPath}`;
};

export const studentApi = {
  // Fetch paginated students with search and department filtering
  getAll: async ({ search = '', department = '', page = 1, limit = 4 } = {}) => {
    const params = new URLSearchParams();
    if (search && search.trim()) params.append('search', search.trim());
    if (department && department !== 'All Departments') params.append('department', department);
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);

    const queryString = params.toString();
    const url = queryString ? `${API_BASE}?${queryString}` : API_BASE;
    const response = await axios.get(url);
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
