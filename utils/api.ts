import axios from 'axios';
import { getToken } from './storage';
import { API_CONFIG } from './config';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log(
    `📤 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
  );

  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.log("AXIOS ERROR 👉", error.message);
    return Promise.reject(error);
  }
);

export default api;
