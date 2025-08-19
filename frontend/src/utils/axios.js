// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  // baseURL: 'http://localhost:5000/api', // change port if different
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // if you're using cookies (for auth)
});





instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});





export default instance;
