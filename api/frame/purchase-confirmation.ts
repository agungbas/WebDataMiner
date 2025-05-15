// Specialized handler for the purchase confirmation image
import type { Request, Response } from 'express';
import app from '../../server/index';

// This handler specifically handles the /api/frame/purchase-confirmation route
export default async function handler(req: Request, res: Response) {
  // Make sure req.path is set correctly
  if (!req.path) {
    req.url = '/api/frame/purchase-confirmation';
  }
  
  // Forward to Express
  return app(req, res);
}