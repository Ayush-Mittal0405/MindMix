import express from 'express';
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getMyPosts,
  postValidation
} from '../controllers/postController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getAllPosts);

// Protected routes (place before dynamic :id to avoid conflicts)
router.get('/my/posts', auth, getMyPosts);

// Public route for single post by ID
router.get('/:id', getPostById);

// Authenticated CRUD
router.post('/', auth, postValidation, createPost);
router.put('/:id', auth, postValidation, updatePost);
router.delete('/:id', auth, deletePost);

export default router; 