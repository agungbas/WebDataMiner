// Specialized handler for the custom amount frame
import type { Request, Response } from 'express';

// This handler specifically handles the /api/frame/custom-amount route
export default async function handler(req: Request, res: Response) {
  // Create SVG image for custom amount input
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
    <circle cx="600" cy="180" r="70" fill="#ffffff" opacity="0.1" />
    <circle cx="600" cy="180" r="60" fill="#ffffff" opacity="0.2" />
    <text x="600" y="180" font-family="Arial, sans-serif" font-size="70" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="#ffffff">$</text>
    
    <!-- Title -->
    <text x="600" y="300" font-family="Arial, sans-serif" font-size="52" font-weight="bold" text-anchor="middle" fill="#ffffff" filter="url(#shadow)">CUSTOM AMOUNT</text>
    
    <!-- Description -->
    <text x="600" y="360" font-family="Arial, sans-serif" font-size="32" text-anchor="middle" fill="#ffffff" opacity="0.7">How many $BISOU tokens would you like to purchase?</text>
    
    <!-- Input Field Box -->
    <rect x="350" y="400" width="500" height="80" rx="10" fill="#ffffff" fill-opacity="0.1" stroke="#ffffff" stroke-opacity="0.3" stroke-width="2" stroke-dasharray="5,5" />
    <text x="600" y="450" font-family="Arial, sans-serif" font-size="30" text-anchor="middle" fill="#ffffff" opacity="0.6">Enter amount here</text>
    
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