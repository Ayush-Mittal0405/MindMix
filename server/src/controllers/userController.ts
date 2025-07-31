import { Request, Response } from 'express';
import { getDB } from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const db = getDB();

    let query = `
      SELECT id, username, email, full_name, bio, avatar_url, role, created_at,
             (SELECT COUNT(*) FROM posts WHERE author_id = users.id) as post_count
      FROM users
      WHERE 1=1
    `;
    const queryParams: any[] = [];

    if (search) {
      query += ' AND (username LIKE ? OR full_name LIKE ? OR email LIKE ?)';
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(Number(limit), offset);

    const [users] = await db.execute(query, queryParams);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
    const countParams: any[] = [];

    if (search) {
      countQuery += ' AND (username LIKE ? OR full_name LIKE ? OR email LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    const [countResult] = await db.execute(countQuery, countParams);
    const total = (countResult as any[])[0].total;

    res.json({
      users,
      pagination: {
        current: Number(page),
        total: Math.ceil(total / Number(limit)),
        hasNext: Number(page) * Number(limit) < total,
        hasPrev: Number(page) > 1
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const db = getDB();

    const [users] = await db.execute(`
      SELECT id, username, email, full_name, bio, avatar_url, role, created_at,
             (SELECT COUNT(*) FROM posts WHERE author_id = users.id) as post_count
      FROM users WHERE id = ?
    `, [id]);

    const user = (users as any[])[0];

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Get user's recent posts
    const [posts] = await db.execute(`
      SELECT p.*, c.name as category_name
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.author_id = ? AND p.status = 'published'
      ORDER BY p.created_at DESC
      LIMIT 5
    `, [id]);

    res.json({
      user: {
        ...user,
        recent_posts: posts
      }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, status = 'published' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const db = getDB();

    // Check if user exists
    const [users] = await db.execute('SELECT id FROM users WHERE id = ?', [id]);
    if ((users as any[]).length === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const [posts] = await db.execute(`
      SELECT p.*, c.name as category_name, c.slug as category_slug,
             (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.author_id = ? AND p.status = ?
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `, [id, status, Number(limit), offset]);

    // Get total count
    const [countResult] = await db.execute(
      'SELECT COUNT(*) as total FROM posts WHERE author_id = ? AND status = ?',
      [id, status]
    );
    const total = (countResult as any[])[0].total;

    res.json({
      posts,
      pagination: {
        current: Number(page),
        total: Math.ceil(total / Number(limit)),
        hasNext: Number(page) * Number(limit) < total,
        hasPrev: Number(page) > 1
      }
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const currentUser = req.user!;
    const db = getDB();

    // Only admins can update user roles
    if (currentUser.role !== 'admin') {
      res.status(403).json({ message: 'Access denied. Admin only.' });
      return;
    }

    // Validate role
    if (!['user', 'admin'].includes(role)) {
      res.status(400).json({ message: 'Invalid role. Must be "user" or "admin"' });
      return;
    }

    // Prevent admin from removing their own admin role
    if (currentUser.id === parseInt(id) && role === 'user') {
      res.status(400).json({ message: 'Cannot remove your own admin role' });
      return;
    }

    await db.execute(
      'UPDATE users SET role = ? WHERE id = ?',
      [role, id]
    );

    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const currentUser = req.user!;
    const db = getDB();

    // Only admins can delete users
    if (currentUser.role !== 'admin') {
      res.status(403).json({ message: 'Access denied. Admin only.' });
      return;
    }

    // Prevent admin from deleting themselves
    if (currentUser.id === parseInt(id)) {
      res.status(400).json({ message: 'Cannot delete your own account' });
      return;
    }

    // Check if user exists
    const [users] = await db.execute('SELECT id FROM users WHERE id = ?', [id]);
    if ((users as any[]).length === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Delete user (this will cascade delete their posts and comments)
    await db.execute('DELETE FROM users WHERE id = ?', [id]);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 