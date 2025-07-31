import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import slugify from 'slugify';
import { getDB } from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, category, search, status = 'published' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const db = getDB();

    let query = `
      SELECT p.*, u.username as author_name, u.avatar_url as author_avatar, 
             c.name as category_name, c.slug as category_slug,
             (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = ?
    `;
    const queryParams: any[] = [status];

    if (category) {
      query += ' AND c.slug = ?';
      queryParams.push(category);
    }

    if (search) {
      query += ' AND (p.title LIKE ? OR p.content LIKE ? OR p.excerpt LIKE ?)';
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(Number(limit), offset);

    const [posts] = await db.execute(query, queryParams);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM posts p LEFT JOIN categories c ON p.category_id = c.id WHERE p.status = ?';
    const countParams: any[] = [status];

    if (category) {
      countQuery += ' AND c.slug = ?';
      countParams.push(category);
    }

    if (search) {
      countQuery += ' AND (p.title LIKE ? OR p.content LIKE ? OR p.excerpt LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    const [countResult] = await db.execute(countQuery, countParams);
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
    console.error('Get all posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const db = getDB();

    // Increment view count
    await db.execute('UPDATE posts SET view_count = view_count + 1 WHERE id = ?', [id]);

    const [posts] = await db.execute(`
      SELECT p.*, u.username as author_name, u.avatar_url as author_avatar, u.bio as author_bio,
             c.name as category_name, c.slug as category_slug
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ? AND p.status = 'published'
    `, [id]);

    const post = (posts as any[])[0];

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    res.json({ post });
  } catch (error) {
    console.error('Get post by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { title, content, excerpt, category_id, status = 'draft' } = req.body;
    const authorId = req.user!.id;
    const db = getDB();

    // Generate slug from title
    const slug = slugify(title, { lower: true, strict: true });

    // Check if slug already exists
    const [existingPosts] = await db.execute(
      'SELECT id FROM posts WHERE slug = ?',
      [slug]
    );

    if ((existingPosts as any[]).length > 0) {
      res.status(400).json({ message: 'A post with this title already exists' });
      return;
    }

    const [result] = await db.execute(`
      INSERT INTO posts (title, slug, content, excerpt, author_id, category_id, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [title, slug, content, excerpt, authorId, category_id, status]);

    const postId = (result as any).insertId;

    // Get the created post
    const [posts] = await db.execute(`
      SELECT p.*, u.username as author_name, c.name as category_name
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [postId]);

    const post = (posts as any[])[0];

    res.status(201).json({
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updatePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const { title, content, excerpt, category_id, status } = req.body;
    const authorId = req.user!.id;
    const db = getDB();

    // Check if post exists and belongs to user
    const [posts] = await db.execute(
      'SELECT * FROM posts WHERE id = ? AND author_id = ?',
      [id, authorId]
    );

    if ((posts as any[]).length === 0) {
      res.status(404).json({ message: 'Post not found or access denied' });
      return;
    }

    // Generate new slug if title changed
    let slug = (posts as any[])[0].slug;
    if (title && title !== (posts as any[])[0].title) {
      slug = slugify(title, { lower: true, strict: true });
      
      // Check if new slug already exists
      const [existingPosts] = await db.execute(
        'SELECT id FROM posts WHERE slug = ? AND id != ?',
        [slug, id]
      );

      if ((existingPosts as any[]).length > 0) {
        res.status(400).json({ message: 'A post with this title already exists' });
        return;
      }
    }

    await db.execute(`
      UPDATE posts 
      SET title = ?, slug = ?, content = ?, excerpt = ?, category_id = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND author_id = ?
    `, [title, slug, content, excerpt, category_id, status, id, authorId]);

    // Get updated post
    const [updatedPosts] = await db.execute(`
      SELECT p.*, u.username as author_name, c.name as category_name
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [id]);

    const post = (updatedPosts as any[])[0];

    res.json({
      message: 'Post updated successfully',
      post
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const authorId = req.user!.id;
    const db = getDB();

    // Check if post exists and belongs to user
    const [posts] = await db.execute(
      'SELECT * FROM posts WHERE id = ? AND author_id = ?',
      [id, authorId]
    );

    if ((posts as any[]).length === 0) {
      res.status(404).json({ message: 'Post not found or access denied' });
      return;
    }

    await db.execute('DELETE FROM posts WHERE id = ? AND author_id = ?', [id, authorId]);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const authorId = req.user!.id;
    const { page = 1, limit = 10, status } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const db = getDB();

    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug,
             (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.author_id = ?
    `;
    const queryParams: any[] = [authorId];

    if (status) {
      query += ' AND p.status = ?';
      queryParams.push(status);
    }

    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(Number(limit), offset);

    const [posts] = await db.execute(query, queryParams);

    res.json({ posts });
  } catch (error) {
    console.error('Get my posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Validation middleware
export const postValidation = [
  body('title')
    .isLength({ min: 1, max: 255 })
    .withMessage('Title is required and must be less than 255 characters'),
  body('content')
    .isLength({ min: 1 })
    .withMessage('Content is required'),
  body('excerpt')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Excerpt must be less than 500 characters'),
  body('category_id')
    .optional()
    .isInt()
    .withMessage('Category ID must be a valid integer'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be either draft or published')
]; 