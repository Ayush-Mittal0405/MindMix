import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  requestPasswordReset,
  resetPassword,
  registerValidation,
  loginValidation,
  requestResetValidation,
  resetPasswordValidation
} from '../controllers/authController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/forgot-password', requestResetValidation, requestPasswordReset);
router.post('/reset-password', resetPasswordValidation, resetPassword);

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

export default router; 