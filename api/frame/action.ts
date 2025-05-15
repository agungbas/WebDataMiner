// Specialized handler for the frame action API endpoint
import type { Request, Response } from 'express';
import { z } from 'zod';
import crypto from 'crypto';

// Farcaster Frame validation schema
const frameMessageSchema = z.object({
  untrustedData: z.object({
    fid: z.number(),
    url: z.string(),
    messageHash: z.string(),
    timestamp: z.number(),
    network: z.number(),
    buttonIndex: z.number(),
    inputText: z.string().optional(),
    castId: z.object({
      fid: z.number(),
      hash: z.string()
    }).optional(),
    frameActionBody: z.string().optional()
  }),
  trustedData: z.object({
    messageBytes: z.string()
  }).optional()
});

// This handler specifically handles the /api/frame/action route for POST requests
export default async function handler(req: Request, res: Response) {
  try {
    // Validate the incoming frame message
    const result = frameMessageSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid frame message format" });
    }

    const { untrustedData } = result.data;
    const baseUrl = getBaseUrlFromVercel(req);
    
    // Generate a unique frame ID for this interaction
    const frameId = crypto.randomBytes(16).toString("hex");
    
    // Log the interaction (just console in serverless)
    console.log(`Frame interaction: ${frameId}, FID: ${untrustedData.fid}, Action: button_${untrustedData.buttonIndex}`);

    // Handle different button actions
    switch (untrustedData.buttonIndex) {
      case 1: // Buy 50 $BISOU
      case 2: // Buy 250 $BISOU
      case 3: // Buy 500 $BISOU
        return handlePurchaseResponse(res, baseUrl, getAmountFromButtonIndex(untrustedData.buttonIndex));
      
      case 4: // Custom amount input
        return handleCustomAmountResponse(res, baseUrl);
      
      case 5: // Custom amount submission
        const amount = parseInt(untrustedData.inputText || "0", 10);
        if (isNaN(amount) || amount <= 0) {
          return handleInvalidAmountResponse(res, baseUrl);
        }
        return handlePurchaseResponse(res, baseUrl, amount);
        
      default:
        return res.status(400).json({ error: "Invalid button index" });
    }
  } catch (error) {
    console.error(`Error processing frame action:`, error);
    return res.status(500).json({ error: "Error processing frame action" });
  }
}

// Helper to get token amount based on button index
function getAmountFromButtonIndex(buttonIndex: number): number {
  switch (buttonIndex) {
    case 1: return 50;
    case 2: return 250;
    case 3: return 500;
    default: return 0;
  }
}

// Handle purchase confirmation response
function handlePurchaseResponse(res: Response, baseUrl: string, amount: number) {
  // Calculate mock price
  const mockPrice = 0.00042;
  const ethAmount = (amount * mockPrice).toFixed(6);
  
  return res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}/api/frame/purchase-confirmation?amount=${amount}&ethAmount=${ethAmount}" />
        <meta property="fc:frame:post_url" content="${baseUrl}/api/frame/action" />
        <meta property="fc:frame:button:1" content="Confirm Purchase" />
        <meta property="fc:frame:button:2" content="Go Back" />
        <meta property="og:title" content="$BISOU Token Purchase" />
        <meta property="og:description" content="Confirm your purchase of ${amount} $BISOU tokens" />
      </head>
      <body>
        <h1>Confirm $BISOU Purchase</h1>
        <p>Amount: ${amount} $BISOU</p>
        <p>Cost: ~${ethAmount} ETH</p>
      </body>
    </html>
  `);
}

// Handle custom amount input
function handleCustomAmountResponse(res: Response, baseUrl: string) {
  return res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}/api/frame/custom-amount" />
        <meta property="fc:frame:post_url" content="${baseUrl}/api/frame/action" />
        <meta property="fc:frame:button:1" content="Continue" />
        <meta property="fc:frame:button:2" content="Go Back" />
        <meta property="fc:frame:input:text" content="Enter amount of $BISOU" />
        <meta property="og:title" content="$BISOU Custom Amount" />
        <meta property="og:description" content="Enter a custom amount of $BISOU tokens to purchase" />
      </head>
      <body>
        <h1>Enter Custom Amount</h1>
        <p>Enter the amount of $BISOU you wish to purchase</p>
      </body>
    </html>
  `);
}

// Handle invalid amount error
function handleInvalidAmountResponse(res: Response, baseUrl: string) {
  return res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}/api/frame/error" />
        <meta property="fc:frame:post_url" content="${baseUrl}/api/frame/action" />
        <meta property="fc:frame:button:1" content="Try Again" />
        <meta property="fc:frame:button:2" content="Go Back" />
        <meta property="og:title" content="$BISOU Error" />
        <meta property="og:description" content="Please enter a valid amount" />
      </head>
      <body>
        <h1>Invalid Amount</h1>
        <p>Please enter a valid number greater than zero.</p>
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