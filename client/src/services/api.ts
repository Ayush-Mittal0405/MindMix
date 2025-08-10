import axios from 'axios';

export const authAPI = axios.create({ baseURL: '/api/auth', headers: { 'Content-Type': 'application/json' } });
export const postsAPI = axios.create({ baseURL: '/api/posts', headers: { 'Content-Type': 'application/json' } });
export const commentsAPI = axios.create({ baseURL: '/api/comments', headers: { 'Content-Type': 'application/json' } });
export const usersAPI = axios.create({ baseURL: '/api/users', headers: { 'Content-Type': 'application/json' } });
export const uploadAPI = axios.create({ baseURL: '/api/upload' });
export const categoriesAPI = axios.create({ baseURL: '/api/categories', headers: { 'Content-Type': 'application/json' } });

const addAuthToken = (config: any) => { const token = localStorage.getItem('token'); if (token) config.headers.Authorization = `Bearer ${token}`; return config; };
authAPI.interceptors.request.use(addAuthToken); postsAPI.interceptors.request.use(addAuthToken); commentsAPI.interceptors.request.use(addAuthToken); usersAPI.interceptors.request.use(addAuthToken); categoriesAPI.interceptors.request.use(addAuthToken); uploadAPI.interceptors.request.use(addAuthToken);

const handleResponseError = (error: any) => { if (error.response?.status === 401) { localStorage.removeItem('token'); window.location.href = '/login'; } return Promise.reject(error); };
authAPI.interceptors.response.use(undefined, handleResponseError); postsAPI.interceptors.response.use(undefined, handleResponseError); commentsAPI.interceptors.response.use(undefined, handleResponseError); usersAPI.interceptors.response.use(undefined, handleResponseError); categoriesAPI.interceptors.response.use(undefined, handleResponseError); uploadAPI.interceptors.response.use(undefined, handleResponseError);

export const api = {
  login: (data: { email: string; password: string }) => authAPI.post('/login', data),
  register: (data: { username: string; email: string; password: string; full_name?: string }) => authAPI.post('/register', data),
  requestPasswordReset: (data: { email: string }) => authAPI.post('/forgot-password', data),
  resetPassword: (data: { token: string; password: string }) => authAPI.post('/reset-password', data),
  getProfile: () => authAPI.get('/profile'),
  updateProfile: (data: { full_name?: string; bio?: string }) => authAPI.put('/profile', data),

  getPosts: (params?: { page?: number; limit?: number; category?: string; search?: string; status?: 'draft' | 'published' | 'all' }) => postsAPI.get('/', { params }),
  getPost: (id: string) => postsAPI.get(`/${id}`),
  createPost: (data: { title: string; content: string; excerpt?: string; category_id?: number; status?: string; featured_image?: string }) => postsAPI.post('/', data),
  updatePost: (id: string, data: { title: string; content: string; excerpt?: string; category_id?: number; status?: string; featured_image?: string }) => postsAPI.put(`/${id}`, data),
  deletePost: (id: string) => postsAPI.delete(`/${id}`),
  getMyPosts: (params?: { page?: number; limit?: number; status?: string }) => postsAPI.get('/my/posts', { params }),

  getComments: (postId: string) => commentsAPI.get(`/post/${postId}`),
  createComment: (postId: string, data: { content: string; parent_id?: number }) => commentsAPI.post(`/post/${postId}`, data),
  updateComment: (id: string, data: { content: string }) => commentsAPI.put(`/${id}`, data),
  deleteComment: (id: string) => commentsAPI.delete(`/${id}`),

  uploadImage: (file: File) => { const form = new FormData(); form.append('image', file); return uploadAPI.post('/image', form, { headers: { 'Content-Type': 'multipart/form-data' } }); },
  uploadAvatar: (file: File) => { const form = new FormData(); form.append('image', file); return uploadAPI.post('/avatar', form, { headers: { 'Content-Type': 'multipart/form-data' } }); },

  listCategories: () => categoriesAPI.get('/'),
  createCategory: (data: { name: string; description?: string }) => categoriesAPI.post('/', data),
  updateCategory: (id: number, data: { name: string; description?: string }) => categoriesAPI.put(`/${id}`, data),
  deleteCategory: (id: number) => categoriesAPI.delete(`/${id}`)
}; 