import type { VercelRequest, VercelResponse } from '@vercel/node';
// Defer importing the server to catch module resolution errors in the response

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const mod = await import('../server/src/app');
    const app = (mod as any).app;
    const ensureDatabaseConnection = (mod as any).ensureDatabaseConnection as () => Promise<void>;
    await ensureDatabaseConnection();
    return (app as any)(req, res);
  } catch (error: any) {
    console.error('Serverless handler init error:', error);
    const message = typeof error?.message === 'string' ? error.message : 'Unknown error';
    return res.status(500).json({ ok: false, error: 'INIT_FAILED', message });
  }
}


