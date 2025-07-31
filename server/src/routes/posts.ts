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
router.get('/:id', getPostById);

// Protected routes
router.get('/my/posts', auth, getMyPosts);
router.post('/', auth, postValidation, createPost);
router.put('/:id', auth, postValidation, updatePost);
router.delete('/:id', auth, deletePost);

export default router; 