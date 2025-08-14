import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import slugify from 'slugify';
import { getDB } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import jwt from 'jsonwebtoken';

export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, category, search, status } = req.query;
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Math.min(50, Number(limit) || 10));
    const offsetNum = (pageNum - 1) * limitNum;
    const db = getDB();

    // Determine effective status: default to 'published' if not provided
    const rawStatus = typeof status === 'string' ? status : undefined;
    const effectiveStatus = rawStatus ?? 'published';

    // Build WHERE clause and parameters
    const conditions: string[] = [];
    const queryParams: any[] = [];

    // Filter by status unless explicitly 'all'
    if (effectiveStatus !== 'all') {
      conditions.push('p.status = ?');
      queryParams.push(effectiveStatus);
    }

    if (category) {
      conditions.push('c.slug = ?');
      queryParams.push(category);
    }

    if (search) {
      conditions.push('(p.title LIKE ? OR p.content LIKE ? OR p.excerpt LIKE ?)');
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    // Always add a default condition to ensure consistent query structure
    if (conditions.length === 0) {
      conditions.push('1 = 1'); // This is always true, so it won't filter anything
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    let query = `
      SELECT p.*, u.username as author_name, u.avatar_url as author_avatar,
             c.name as category_name, c.slug as category_slug,
             (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY p.created_at DESC LIMIT ${limitNum} OFFSET ${offsetNum}
    `;

    // No LIMIT/OFFSET params to push, already inlined after sanitization

    console.log('SQL Query:', query);
    console.log('Query Parameters:', queryParams);

    const [posts] = await db.execute(query, queryParams);

    // Get total count for pagination
    const countConditions: string[] = [];
    const countParams: any[] = [];

    // Apply the same status logic for count
    if (effectiveStatus !== 'all') {
      countConditions.push('p.status = ?');
      countParams.push(effectiveStatus);
    }

    if (category) {
      countConditions.push('c.slug = ?');
      countParams.push(category);
    }

    if (search) {
      countConditions.push('(p.title LIKE ? OR p.content LIKE ? OR p.excerpt LIKE ?)');
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    // Always add a default condition to ensure consistent query structure
    if (countConditions.length === 0) {
      countConditions.push('1 = 1'); // This is always true, so it won't filter anything
    }

    const countWhereClause = `WHERE ${countConditions.join(' AND ')}`;

    let countQuery = `SELECT COUNT(*) as total FROM posts p LEFT JOIN categories c ON p.category_id = c.id ${countWhereClause}`;
    
    console.log('Count Query:', countQuery);
    console.log('Count Parameters:', countParams);
    
    const [countResult] = await db.execute(countQuery, countParams);
    const total = (countResult as any[])[0].total;

    res.json({
      posts,
      pagination: {
        current: pageNum,
        total: Math.ceil(total / limitNum),
        hasNext: pageNum * limitNum < total,
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Get all posts error:', error);
    const err: any = error;
    const isProd = (process.env.NODE_ENV || 'development') === 'production';
    res.status(500).json({
      message: 'Server error',
      ...(isProd ? {} : { error: err?.message || String(err), sql: err?.sql, sqlMessage: err?.sqlMessage })
    });
  }
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const db = getDB();

    // Try to identify user (if token provided) to allow viewing own drafts
    let requesterId: number | null = null;
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(authHeader.replace('Bearer ', ''), process.env.JWT_SECRET || 'your-secret-key') as any;
        requesterId = decoded.userId as number;
      } catch {
        requesterId = null;
      }
    }

    // Fetch post regardless of status
    const [rows] = await db.execute(`
      SELECT p.*, u.username as author_name, u.avatar_url as author_avatar, u.bio as author_bio,
             c.name as category_name, c.slug as category_slug
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [id]);

    const post = (rows as any[])[0];

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    // Only allow drafts to be viewed by their author (or if published)
    const isOwner = requesterId !== null && requesterId === post.author_id;
    if (post.status !== 'published' && !isOwner) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    // Increment views only for published posts
    if (post.status === 'published') {
      await db.execute('UPDATE posts SET view_count = view_count + 1 WHERE id = ?', [id]);
      post.view_count = (post.view_count || 0) + 1;
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

    const body: any = (req as unknown as Request).body;
    const { title, content } = body as { title: string; content: string };
    const rawExcerpt = body.excerpt as string | undefined;
    const rawCategoryId = body.category_id as number | string | undefined;
    const rawStatus = body.status as 'draft' | 'published' | undefined;
    const featured_image = body.featured_image as string | undefined;

    const excerpt = rawExcerpt ?? null;
    const category_id = rawCategoryId ? Number(rawCategoryId) : null;
    const status: 'draft' | 'published' = rawStatus === 'published' ? 'published' : 'draft';

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
      INSERT INTO posts (title, slug, content, excerpt, featured_image, author_id, category_id, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [title, slug, content, excerpt, featured_image ?? null, authorId, category_id, status]);

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

    const params = (req as unknown as Request).params;
    const body: any = (req as unknown as Request).body;
    const { id } = params;
    const { title, content } = body as { title: string; content: string };
    const rawExcerpt = body.excerpt as string | undefined;
    const rawCategoryId = body.category_id as number | string | undefined;
    const rawStatus = body.status as 'draft' | 'published' | undefined;
    const newFeaturedImage = body.featured_image as string | undefined;

    const excerpt = rawExcerpt ?? null;
    const category_id = rawCategoryId ? Number(rawCategoryId) : null;
    const status: 'draft' | 'published' = rawStatus === 'published' ? 'published' : 'draft';

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

    const existing = (posts as any[])[0];

    // Generate new slug if title changed
    let slug = existing.slug as string;
    if (title && title !== existing.title) {
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

    const featured_image = newFeaturedImage !== undefined ? newFeaturedImage : existing.featured_image;

    await db.execute(`
      UPDATE posts 
      SET title = ?, slug = ?, content = ?, excerpt = ?, featured_image = ?, category_id = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND author_id = ?
    `, [title, slug, content, excerpt, featured_image ?? null, category_id, status, id, authorId]);

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
    const { page = 1, limit = 10, status } = (req as unknown as Request).query as any;

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Math.min(50, Number(limit) || 10));
    const offsetNum = (pageNum - 1) * limitNum;

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

    query += ` ORDER BY p.created_at DESC LIMIT ${limitNum} OFFSET ${offsetNum}`;

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