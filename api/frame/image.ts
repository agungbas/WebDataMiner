// Specialized handler for the frame image API endpoint
import type { Request, Response } from 'express';
import app from '../../server/index';

// This handler specifically handles the /api/frame/image route
export default async function handler(req: Request, res: Response) {
  // Make sure req.path is set correctly
  if (!req.path) {
    req.url = '/api/frame/image';
  }
  
  // Forward to Express
  return app(req, res);
}