// axiosInstance.js
import axios from 'axios';

const baseURL = 'https://king-prawn-app-s8sf3.ondigitalocean.app/expensetracker/api'; // replace with your API base URL

const Axios = axios.create({
  baseURL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  
    // You can add other common headers here
  },
});

// Add a request interceptor
Axios.interceptors.request.use(
  (config) => {
    // Modify the request config here (e.g., add Authorization header)
    const token = localStorage.getItem('TOKEN'); // Replace with your token retrieval logic
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;

    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
Axios.interceptors.response.use(
  (response) => {
    // Modify the response data here
    return response;
  },
  (error) => {
    // Handle errors here
    return Promise.reject(error);
  }
);

export default Axios;
