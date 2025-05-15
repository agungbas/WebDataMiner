// Health check endpoint for Vercel
import type { Request, Response } from 'express';

// Simple health check that returns status and environment info
export default function handler(req: Request, res: Response) {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'unknown',
    vercel: process.env.VERCEL ? true : false,
    vercelUrl: process.env.VERCEL_URL || 'not-set'
  });
}