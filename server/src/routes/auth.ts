import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  registerValidation,
  loginValidation
} from '../controllers/authController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

export default router; 