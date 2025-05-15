// Specialized handler for the purchase confirmation image
import type { Request, Response } from 'express';

// This handler specifically handles the /api/frame/purchase-confirmation route
export default async function handler(req: Request, res: Response) {
  const amount = req.query.amount || "0";
  const ethAmount = req.query.ethAmount || "0";
  
  // Create SVG image for purchase confirmation
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
    <text x="600" y="300" font-family="Arial, sans-serif" font-size="52" font-weight="bold" text-anchor="middle" fill="#ffffff" filter="url(#shadow)">CONFIRM PURCHASE</text>
    
    <!-- Purchase Box -->
    <rect x="350" y="330" width="500" height="180" rx="10" fill="#ffffff" fill-opacity="0.1" />
    
    <!-- Amount Row -->
    <text x="400" y="380" font-family="Arial, sans-serif" font-size="28" fill="#ffffff" opacity="0.7">$BISOU Amount:</text>
    <text x="800" y="380" font-family="Arial, sans-serif" font-size="28" font-weight="bold" text-anchor="end" fill="#ffffff">${amount} tokens</text>
    
    <!-- Separator Line -->
    <line x1="375" y1="410" x2="825" y2="410" stroke="#ffffff" stroke-opacity="0.1" stroke-width="2" />
    
    <!-- Cost Row -->
    <text x="400" y="450" font-family="Arial, sans-serif" font-size="28" fill="#ffffff" opacity="0.7">Cost:</text>
    <text x="800" y="450" font-family="Arial, sans-serif" font-size="28" font-weight="bold" text-anchor="end" fill="#ffffff">~${ethAmount} ETH</text>
    
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
}