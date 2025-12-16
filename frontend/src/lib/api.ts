import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('accessToken') 
    : null;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401) {
      try {
        const refreshResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        
        const { accessToken } = refreshResponse.data;
        localStorage.setItem('accessToken', accessToken);
        
        if (originalRequest) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
