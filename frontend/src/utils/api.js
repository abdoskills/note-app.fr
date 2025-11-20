import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend URL
  timeout: 10000,
});

// Add auth token to every request
API.interceptors.request.use(
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

// Handle response errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API calls - MATCHING YOUR BACKEND
export const authAPI = {
  register: (userData) => API.post('/auth/register', userData),
  login: (credentials) => API.post('/auth/login', credentials),
};

// Notes API calls - MATCHING YOUR BACKEND
export const notesAPI = {
  getAllNotes: () => API.get('/notes'),
  createNote: (noteData) => API.post('/notes', noteData),
  updateNote: (id, noteData) => API.put(`/notes/${id}`, noteData),
  deleteNote: (id) => API.delete(`/notes/${id}`),
};

// Utility functions
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export default API;