import axios from 'axios';

const API_BASE_URL = '/api';

// Users API
export const usersAPI = {
  getAll: () => axios.get(`${API_BASE_URL}/users`),
  getById: (id) => axios.get(`${API_BASE_URL}/users/${id}`),
  getMe: () => axios.get(`${API_BASE_URL}/users/me`),
  update: (id, data) => axios.put(`${API_BASE_URL}/users/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE_URL}/users/${id}`),
  search: (query) => axios.get(`${API_BASE_URL}/users/search/${query}`)
};

// Chat Rooms API
export const chatRoomsAPI = {
  getAll: () => axios.get(`${API_BASE_URL}/chatrooms`),
  getById: (id) => axios.get(`${API_BASE_URL}/chatrooms/${id}`),
  create: (data) => axios.post(`${API_BASE_URL}/chatrooms`, data),
  getMessages: (id, params) => axios.get(`${API_BASE_URL}/chatrooms/${id}/messages`, { params }),
  addParticipant: (id, userId) => axios.post(`${API_BASE_URL}/chatrooms/${id}/participants`, { userId }),
  removeParticipant: (id, userId) => axios.delete(`${API_BASE_URL}/chatrooms/${id}/participants/${userId}`)
};

// Analytics API
export const analyticsAPI = {
  getDashboard: () => axios.get(`${API_BASE_URL}/analytics/dashboard`),
  getUserActivity: (userId) => axios.get(`${API_BASE_URL}/analytics/user-activity/${userId}`)
};

export default {
  users: usersAPI,
  chatRooms: chatRoomsAPI,
  analytics: analyticsAPI
};
