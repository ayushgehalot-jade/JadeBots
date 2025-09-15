import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API service functions
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
};

export const resumeAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/resumes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getAll: () => api.get('/resumes'),
  getById: (id) => api.get(`/resumes/${id}`),
  delete: (id) => api.delete(`/resumes/${id}`),
};

export const jdAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/jds/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getAll: () => api.get('/jds'),
  getById: (id) => api.get(`/jds/${id}`),
  delete: (id) => api.delete(`/jds/${id}`),
};

export const matchAPI = {
  create: (resumeId, jdId) => {
    const formData = new FormData();
    formData.append('resume_id', resumeId);
    formData.append('jd_id', jdId);
    return api.post('/matches', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getAll: () => api.get('/matches'),
  getById: (id) => api.get(`/matches/${id}`),
  delete: (id) => api.delete(`/matches/${id}`),
};

export const jadeAPI = {
  convert: (resumeId) => api.post(`/jade/convert/${resumeId}`),
  uploadTemplate: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/jade/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getTemplates: () => api.get('/jade/templates'),
  setActiveTemplate: (templateId) => api.put(`/jade/templates/${templateId}/activate`),
  deleteTemplate: (templateId) => api.delete(`/jade/templates/${templateId}`),
};


