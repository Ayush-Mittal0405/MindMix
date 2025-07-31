import express from 'express';
import {
  getAllUsers,
  getUserById,
  getUserPosts,
  updateUserRole,
  deleteUser
} from '../controllers/userController';
import { auth, adminAuth } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.get('/:id/posts', getUserPosts);

// Admin only routes
router.put('/:id/role', adminAuth, updateUserRole);
router.delete('/:id', adminAuth, deleteUser);

export default router; 