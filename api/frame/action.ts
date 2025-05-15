// Specialized handler for the frame action API endpoint
import type { Request, Response } from 'express';
import app from '../../server/index';

// This handler specifically handles the /api/frame/action route for POST requests
export default async function handler(req: Request, res: Response) {
  // Make sure req.path is set correctly
  if (!req.path) {
    req.url = '/api/frame/action';
  }
  
  // Forward to Express
  return app(req, res);
}