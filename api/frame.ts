// Specialized handler for the frame API endpoint
import type { Request, Response } from 'express';

// This handler specifically handles the /api/frame route
export default async function handler(req: Request, res: Response) {
  // Get base URL for links
  const baseUrl = getBaseUrlFromVercel(req);
  
  // Frame metadata with initial view
  return res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}/api/frame/image" />
        <meta property="fc:frame:post_url" content="${baseUrl}/api/frame/action" />
        <meta property="fc:frame:button:1" content="Buy 50 $BISOU" />
        <meta property="fc:frame:button:2" content="Buy 250 $BISOU" />
        <meta property="fc:frame:button:3" content="Buy 500 $BISOU" />
        <meta property="fc:frame:button:4" content="Custom Amount" />
        <meta property="og:title" content="$BISOU Token" />
        <meta property="og:description" content="Purchase $BISOU tokens on Base network" />
      </head>
      <body>
        <h1>$BISOU Token Frame</h1>
        <p>This is a Farcaster Frame for purchasing $BISOU tokens.</p>
      </body>
    </html>
  `);
}

// Helper function to get the base URL
function getBaseUrlFromVercel(req: Request): string {
  // Vercel production environment
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Check for custom domain via x-forwarded-host (used by Vercel)
  const forwardedHost = req.headers["x-forwarded-host"];
  if (forwardedHost) {
    const protocol = req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
    return `${protocol}://${forwardedHost}`;
  }

  // Other production environments, use the host from the request
  const host = req.headers["host"];
  if (host) {
    const protocol = req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
    return `${protocol}://${host}`;
  }
  
  // Fallback (note: this won't work with Warpcast)
  return "https://bisou-wine.vercel.app";
}