import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('access_token', access);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: {
    username: string;
    email: string;
    password: string;
    password2: string;
    first_name?: string;
    last_name?: string;
  }) => api.post('/auth/register/', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login/', data),

  logout: (refreshToken: string) =>
    api.post('/auth/logout/', { refresh: refreshToken }),

  getProfile: () => api.get('/auth/profile/'),

  updateProfile: (data: any) => api.patch('/auth/profile/', data),

  changePassword: (data: {
    old_password: string;
    new_password: string;
    new_password2: string;
  }) => api.post('/auth/change-password/', data),

  getUsage: () => api.get('/auth/usage/'),
};

// Keywords API
export const keywordsAPI = {
  research: (data: { keyword: string; country?: string; language?: string }) =>
    api.post('/keywords/research/', data),

  list: () => api.get('/keywords/'),

  get: (id: string) => api.get(`/keywords/${id}/`),
};

// Content API
export const contentAPI = {
  generate: (data: {
    keyword: string;
    platforms: string[];
    content_type?: string;
    tone?: string;
    angle?: string;
    niche?: string;
    generate_images?: boolean;
    image_count?: number;
    generate_video_script?: boolean;
  }) => api.post('/content/blocks/generate/', data),

  generateImage: (data: {
    prompt: string;
    style?: string;
    size?: string;
  }) => api.post('/content/blocks/generate_image/', data),

  listBlocks: () => api.get('/content/blocks/'),

  getBlock: (id: string) => api.get(`/content/blocks/${id}/`),

  listImages: () => api.get('/content/images/'),

  listBrandKits: () => api.get('/content/brand-kits/'),
};

export default api;
