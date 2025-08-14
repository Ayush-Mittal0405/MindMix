import { Request, Response } from 'express';
import type { Express } from 'express';
import multer from 'multer';
import path from 'path';
import { getDB } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { put } from '@vercel/blob';

// Use in-memory storage for serverless environments
export const upload = multer({ storage: multer.memoryStorage() });

const buildSafeFileName = (originalName: string): string => {
  const ext = path.extname(originalName) || '.bin';
  const base = path
    .basename(originalName, ext)
    .replace(/[^a-zA-Z0-9-_]/g, '')
    .slice(0, 40) || 'file';
  return `${base}_${Date.now()}${ext}`;
};

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }
    const fileName = buildSafeFileName(file.originalname);
    const blob = await put(`uploads/${fileName}`, file.buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN
    });
    res.status(201).json({ url: blob.url });
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
    const fileName = buildSafeFileName(file.originalname);
    const blob = await put(`avatars/${fileName}`, file.buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN
    });
    const db = getDB();
    await db.execute('UPDATE users SET avatar_url = ? WHERE id = ?', [blob.url, req.user!.id]);
    res.status(201).json({ avatar_url: blob.url });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
