import type { VercelRequest, VercelResponse } from '@vercel/node';
import { app, ensureDatabaseConnection } from '../server/src/app';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Ensure DB is connected in the serverless environment
  await ensureDatabaseConnection();
  return (app as any)(req, res);
}


