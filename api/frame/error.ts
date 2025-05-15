// Specialized handler for the error frame
import type { Request, Response } from 'express';

// This handler specifically handles the /api/frame/error route
export default async function handler(req: Request, res: Response) {
  // Create SVG image for error
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
    
    <!-- Error Icon -->
    <text x="600" y="220" font-family="Arial, sans-serif" font-size="120" text-anchor="middle" fill="#f44336">⚠️</text>
    
    <!-- Title -->
    <text x="600" y="340" font-family="Arial, sans-serif" font-size="52" font-weight="bold" text-anchor="middle" fill="#f44336" filter="url(#shadow)">INVALID AMOUNT</text>
    
    <!-- Description -->
    <text x="600" y="400" font-family="Arial, sans-serif" font-size="32" text-anchor="middle" fill="#ffffff" opacity="0.7">Please enter a valid number of tokens greater than zero.</text>
    
    <!-- Network -->
    <rect x="520" y="530" width="160" height="40" rx="20" fill="#ffffff" fill-opacity="0.1" />
    <text x="600" y="558" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" fill="#ffffff">BASE NETWORK</text>
  </svg>
  `;
  
  // Set appropriate headers and send the SVG
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(svgImage);
}