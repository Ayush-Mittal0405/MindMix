import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getDB } from '../config/database';
import { AuthRequest } from '../middleware/auth';

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '').slice(0, 40);
    const filename = `${base || 'image'}_${Date.now()}${ext}`;
    cb(null, filename);
  }
});

export const upload = multer({ storage });

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }
    const url = `/uploads/${file.filename}`;
    res.status(201).json({ url });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const uploadAvatar = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }
    const url = `/uploads/${file.filename}`;
    const db = getDB();
    await db.execute('UPDATE users SET avatar_url = ? WHERE id = ?', [url, req.user!.id]);
    res.status(201).json({ avatar_url: url });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
