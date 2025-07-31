export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  role: 'user' | 'admin';
  created_at: string;
  post_count?: number;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  status: 'draft' | 'published';
  author_id: number;
  category_id?: number;
  view_count: number;
  created_at: string;
  updated_at: string;
  author_name?: string;
  author_avatar?: string;
  author_bio?: string;
  category_name?: string;
  category_slug?: string;
  comment_count?: number;
}

export interface Comment {
  id: number;
  content: string;
  post_id: number;
  user_id: number;
  parent_id?: number;
  created_at: string;
  updated_at: string;
  username?: string;
  avatar_url?: string;
  full_name?: string;
  replies?: Comment[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

export interface Pagination {
  current: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  excerpt?: string;
  category_id?: number;
  status?: 'draft' | 'published';
}

export interface CreateCommentData {
  content: string;
  parent_id?: number;
} 