import axios from 'axios';

// Use environment variable for API base URL, fallback to local development
const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 180000, // 3 minutes timeout for video processing
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    
    if (error.response?.status === 400) {
      throw new Error(error.response.data?.detail || 'Invalid request');
    } else if (error.response?.status === 404) {
      throw new Error(error.response.data?.detail || 'Video not found or unavailable');
    } else if (error.response?.status === 429) {
      throw new Error(error.response.data?.detail || 'YouTube is currently blocking requests. Please try again in a few minutes.');
    } else if (error.response?.status === 500) {
      throw new Error('Server error occurred while processing the video');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - the video might be too large or server is busy');
    } else if (error.code === 'ERR_NETWORK') {
      throw new Error('Network error - please check your connection and backend URL');
    }
    
    throw new Error(error.response?.data?.detail || 'An unexpected error occurred');
  }
);

export const downloadVideo = async (url) => {
  try {
    const response = await api.post('/api/download', { url });
    
    // Ensure the download URL is absolute
    const result = response.data;
    if (result.downloadUrl && !result.downloadUrl.startsWith('http')) {
      result.downloadUrl = `${API_BASE_URL}${result.downloadUrl}`;
    }
    
    return result;
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};

export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check error:', error);
    throw error;
  }
};

export default api;
