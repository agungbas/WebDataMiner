// Serverless API handler for Vercel
import type { Request, Response } from 'express';
import app from '../server/index';

// This is a simple handler that forwards requests to our Express app
export default async function handler(req: Request, res: Response) {
  // Forward the request to the Express app
  return app(req, res);
}