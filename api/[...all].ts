import type { VercelRequest, VercelResponse } from '@vercel/node';
import { app, ensureDatabaseConnection } from '../server/dist/app';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Ensure DB is connected in the serverless environment
    await ensureDatabaseConnection();
  } catch (error: any) {
    console.error('Database initialization error:', error);
    const message = typeof error?.message === 'string' ? error.message : 'Unknown error';
    return res.status(500).json({ ok: false, error: 'DB_INIT_FAILED', message });
  }
  return (app as any)(req, res);
}


