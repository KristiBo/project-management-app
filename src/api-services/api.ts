import axios from 'axios';

const API_URL = `https://infinite-oasis-01603.herokuapp.com`;

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
