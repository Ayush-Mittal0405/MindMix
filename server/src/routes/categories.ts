import express from 'express';
import { adminAuth } from '../middleware/auth';
import { listCategories, createCategory, updateCategory, deleteCategory, categoryValidation } from '../controllers/categoryController';

const router = express.Router();

router.get('/', listCategories);
router.post('/', adminAuth, categoryValidation, createCategory);
router.put('/:id', adminAuth, categoryValidation, updateCategory);
router.delete('/:id', adminAuth, deleteCategory);

export default router;
