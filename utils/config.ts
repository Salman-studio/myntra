// API Configuration
// For local development, use your computer's IP address instead of localhost
// Find your IP: Windows (ipconfig), Mac/Linux (ifconfig)
// Example: http://192.168.1.100:5000/api

// Change this to your local IP address when testing on mobile device
// Or use localhost when testing on web/emulator
const API_BASE_URL = __DEV__ 
  ? 'http://192.168.0.151:5000/api' // Change this to your local IP
  : 'https://myntra-clone-xj36.onrender.com/api'; // Production URL

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 10000,
};

export default API_CONFIG;
