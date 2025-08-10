import { Request, Response } from 'express';
import slugify from 'slugify';
import { getDB } from '../config/database';
import { body, validationResult } from 'express-validator';

export const listCategories = async (_req: Request, res: Response) => {
  const db = getDB();
  const [rows] = await db.execute('SELECT * FROM categories ORDER BY name ASC');
  res.json({ categories: rows });
};

export const createCategory = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, description } = req.body as { name: string; description?: string };
  const slug = slugify(name, { lower: true, strict: true });
  const db = getDB();
  await db.execute('INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)', [name, slug, description || null]);
  res.status(201).json({ message: 'Category created' });
};

export const updateCategory = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { id } = req.params;
  const { name, description } = req.body as { name: string; description?: string };
  const slug = slugify(name, { lower: true, strict: true });
  const db = getDB();
  await db.execute('UPDATE categories SET name = ?, slug = ?, description = ? WHERE id = ?', [name, slug, description || null, id]);
  res.json({ message: 'Category updated' });
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDB();
  await db.execute('DELETE FROM categories WHERE id = ?', [id]);
  res.json({ message: 'Category deleted' });
};

export const categoryValidation = [
  body('name').isLength({ min: 1, max: 50 }).withMessage('Name is required and <= 50 chars')
];
