// Simple test endpoint that doesn't rely on Express
import type { Request, Response } from 'express';

// Test endpoint that doesn't go through the Express app
export default function handler(req: Request, res: Response) {
  res.status(200).json({
    message: 'API handler is working correctly',
    timestamp: new Date().toISOString(),
    vercel: process.env.VERCEL === '1',
    vercelUrl: process.env.VERCEL_URL || 'not-set',
    headers: {
      host: req.headers.host,
      forwardedHost: req.headers['x-forwarded-host'],
      forwardedProto: req.headers['x-forwarded-proto']
    }
  });
}