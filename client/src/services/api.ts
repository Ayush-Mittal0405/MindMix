import axios from 'axios';

// Create axios instance for API calls
export const authAPI = axios.create({
  baseURL: '/api/auth',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const postsAPI = axios.create({
  baseURL: '/api/posts',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const commentsAPI = axios.create({
  baseURL: '/api/comments',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const usersAPI = axios.create({
  baseURL: '/api/users',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
const addAuthToken = (config: any) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

authAPI.interceptors.request.use(addAuthToken);
postsAPI.interceptors.request.use(addAuthToken);
commentsAPI.interceptors.request.use(addAuthToken);
usersAPI.interceptors.request.use(addAuthToken);

// Add response interceptor to handle errors
const handleResponseError = (error: any) => {
  if (error.response?.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
};

authAPI.interceptors.response.use(undefined, handleResponseError);
postsAPI.interceptors.response.use(undefined, handleResponseError);
commentsAPI.interceptors.response.use(undefined, handleResponseError);
usersAPI.interceptors.response.use(undefined, handleResponseError);

// API functions
export const api = {
  // Auth
  login: (data: { email: string; password: string }) => 
    authAPI.post('/login', data),
  
  register: (data: { username: string; email: string; password: string; full_name?: string }) => 
    authAPI.post('/register', data),
  
  getProfile: () => 
    authAPI.get('/profile'),
  
  updateProfile: (data: { full_name?: string; bio?: string }) => 
    authAPI.put('/profile', data),

  // Posts
  getPosts: (params?: { page?: number; limit?: number; category?: string; search?: string }) => 
    postsAPI.get('/', { params }),
  
  getPost: (id: string) => 
    postsAPI.get(`/${id}`),
  
  createPost: (data: { title: string; content: string; excerpt?: string; category_id?: number; status?: string }) => 
    postsAPI.post('/', data),
  
  updatePost: (id: string, data: { title: string; content: string; excerpt?: string; category_id?: number; status?: string }) => 
    postsAPI.put(`/${id}`, data),
  
  deletePost: (id: string) => 
    postsAPI.delete(`/${id}`),
  
  getMyPosts: (params?: { page?: number; limit?: number; status?: string }) => 
    postsAPI.get('/my/posts', { params }),

  // Comments
  getComments: (postId: string) => 
    commentsAPI.get(`/post/${postId}`),
  
  createComment: (postId: string, data: { content: string; parent_id?: number }) => 
    commentsAPI.post(`/post/${postId}`, data),
  
  updateComment: (id: string, data: { content: string }) => 
    commentsAPI.put(`/${id}`, data),
  
  deleteComment: (id: string) => 
    commentsAPI.delete(`/${id}`),

  // Users
  getUsers: (params?: { page?: number; limit?: number; search?: string }) => 
    usersAPI.get('/', { params }),
  
  getUser: (id: string) => 
    usersAPI.get(`/${id}`),
  
  getUserPosts: (id: string, params?: { page?: number; limit?: number; status?: string }) => 
    usersAPI.get(`/${id}/posts`, { params }),
  
  updateUserRole: (id: string, data: { role: string }) => 
    usersAPI.put(`/${id}/role`, data),
  
  deleteUser: (id: string) => 
    usersAPI.delete(`/${id}`),
}; 