import axios from 'axios';

const API_URL = `https://boiling-ocean-73704-69419e757707.herokuapp.com/`;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    config.headers!['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

export default api;
