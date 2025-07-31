import express from 'express';
import {
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
  commentValidation
} from '../controllers/commentController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/post/:postId', getCommentsByPost);

// Protected routes
router.post('/post/:postId', auth, commentValidation, createComment);
router.put('/:id', auth, commentValidation, updateComment);
router.delete('/:id', auth, deleteComment);

export default router; 