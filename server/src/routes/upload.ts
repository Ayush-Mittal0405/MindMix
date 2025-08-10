import express from 'express';
import { auth } from '../middleware/auth';
import { upload, uploadImage, uploadAvatar } from '../controllers/uploadController';

const router = express.Router();

router.post('/image', upload.single('image'), uploadImage);
router.post('/avatar', auth, upload.single('image'), uploadAvatar);

export default router;
