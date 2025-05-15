// Specialized handler for the frame image API endpoint
import type { Request, Response } from 'express';

// This handler specifically handles the /api/frame/image route
export default async function handler(req: Request, res: Response) {
  // Create a simple SVG image directly instead of fetching from IPFS
  // This ensures the image will always load and bypasses potential CORS issues
  const svgImage = `
  <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f0c29" />
        <stop offset="50%" stop-color="#302b63" />
        <stop offset="100%" stop-color="#24243e" />
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.3" />
      </filter>
    </defs>
    
    <!-- Background -->
    <rect width="100%" height="100%" fill="url(#grad)" />
    
    <!-- Token Logo Circle -->
    <circle cx="600" cy="260" r="120" fill="#ffffff" opacity="0.1" />
    <circle cx="600" cy="260" r="100" fill="#ffffff" opacity="0.2" />
    <text x="600" y="260" font-family="Arial, sans-serif" font-size="120" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="#ffffff">$</text>
    
    <!-- Token Name -->
    <text x="600" y="430" font-family="Arial, sans-serif" font-size="72" font-weight="bold" text-anchor="middle" fill="#ffffff" filter="url(#shadow)">$BISOU TOKEN</text>
    
    <!-- Network -->
    <rect x="520" y="470" width="160" height="40" rx="20" fill="#ffffff" fill-opacity="0.1" />
    <text x="600" y="498" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" fill="#ffffff">BASE NETWORK</text>
    
    <!-- Call to Action -->
    <text x="600" y="550" font-family="Arial, sans-serif" font-size="32" text-anchor="middle" fill="#ffffff" opacity="0.8">Buy $BISOU tokens now!</text>
  </svg>
  `;
  
  // Set appropriate headers and send the SVG
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(svgImage);
}