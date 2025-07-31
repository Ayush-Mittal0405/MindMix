import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getDB } from '../config/database';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ message: 'No token, authorization denied' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    const db = getDB();
    
    const [users] = await db.execute(
      'SELECT id, username, email, role FROM users WHERE id = ?',
      [decoded.userId]
    );

    const user = (users as any[])[0];

    if (!user) {
      res.status(401).json({ message: 'Token is not valid' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export const adminAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await auth(req, res, () => {
      if (req.user?.role !== 'admin') {
        res.status(403).json({ message: 'Access denied. Admin only.' });
        return;
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
}; 