import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { getDB } from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getCommentsByPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const db = getDB();

    const [comments] = await db.execute(`
      SELECT c.*, u.username, u.avatar_url, u.full_name
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ? AND c.parent_id IS NULL
      ORDER BY c.created_at DESC
    `, [postId]);

    // Get replies for each comment
    const commentsWithReplies = await Promise.all(
      (comments as any[]).map(async (comment) => {
        const [replies] = await db.execute(`
          SELECT c.*, u.username, u.avatar_url, u.full_name
          FROM comments c
          LEFT JOIN users u ON c.user_id = u.id
          WHERE c.parent_id = ?
          ORDER BY c.created_at ASC
        `, [comment.id]);

        return {
          ...comment,
          replies: replies
        };
      })
    );

    res.json({ comments: commentsWithReplies });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { postId } = req.params;
    const { content, parent_id } = req.body;
    const userId = req.user!.id;
    const db = getDB();

    // Check if post exists
    const [posts] = await db.execute(
      'SELECT id FROM posts WHERE id = ? AND status = "published"',
      [postId]
    );

    if ((posts as any[]).length === 0) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    // If this is a reply, check if parent comment exists
    if (parent_id) {
      const [parentComments] = await db.execute(
        'SELECT id FROM comments WHERE id = ? AND post_id = ?',
        [parent_id, postId]
      );

      if ((parentComments as any[]).length === 0) {
        res.status(400).json({ message: 'Parent comment not found' });
        return;
      }
    }

    const [result] = await db.execute(`
      INSERT INTO comments (content, post_id, user_id, parent_id)
      VALUES (?, ?, ?, ?)
    `, [content, postId, userId, parent_id || null]);

    const commentId = (result as any).insertId;

    // Get the created comment with user info
    const [comments] = await db.execute(`
      SELECT c.*, u.username, u.avatar_url, u.full_name
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `, [commentId]);

    const comment = (comments as any[])[0];

    res.status(201).json({
      message: 'Comment created successfully',
      comment
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user!.id;
    const db = getDB();

    // Check if comment exists and belongs to user
    const [comments] = await db.execute(
      'SELECT * FROM comments WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if ((comments as any[]).length === 0) {
      res.status(404).json({ message: 'Comment not found or access denied' });
      return;
    }

    await db.execute(
      'UPDATE comments SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
      [content, id, userId]
    );

    // Get updated comment
    const [updatedComments] = await db.execute(`
      SELECT c.*, u.username, u.avatar_url, u.full_name
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `, [id]);

    const comment = (updatedComments as any[])[0];

    res.json({
      message: 'Comment updated successfully',
      comment
    });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const db = getDB();

    // Check if comment exists and belongs to user
    const [comments] = await db.execute(
      'SELECT * FROM comments WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if ((comments as any[]).length === 0) {
      res.status(404).json({ message: 'Comment not found or access denied' });
      return;
    }

    // Delete comment and all its replies
    await db.execute('DELETE FROM comments WHERE id = ? OR parent_id = ?', [id, id]);

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Validation middleware
export const commentValidation = [
  body('content')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment content is required and must be less than 1000 characters'),
  body('parent_id')
    .optional()
    .isInt()
    .withMessage('Parent ID must be a valid integer')
]; 