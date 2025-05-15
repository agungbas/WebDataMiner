import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { log } from "./vite";
import crypto from "crypto";

// Farcaster Frame validation
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

type FrameMessage = z.infer<typeof frameMessageSchema>;

// Generate the base URL for Frame responses
function getBaseUrl(req: Request): string {
  // Vercel production environment
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Other production environments, use the host from the request
  if (process.env.NODE_ENV === "production") {
    return `${req.protocol}://${req.get("host")}`;
  }
  
  // In development, use the Replit URL if available
  const replitSlug = process.env.REPL_SLUG;
  const replitOwner = process.env.REPL_OWNER;
  
  if (replitSlug && replitOwner) {
    return `https://${replitSlug}.${replitOwner}.repl.co`;
  }
  
  // Fallback to localhost (note: this won't work with Warpcast)
  return "http://localhost:5000";
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Frame entry point
  app.get("/api/frame", async (req, res) => {
    const baseUrl = getBaseUrl(req);
    
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
  });

  // Frame image endpoint - serves the token image
  app.get("/api/frame/image", async (req, res) => {
    const tokenImageUrl = "https://ipfs.io/ipfs/bafkreighrlz43fgcdmqdtyv755zmsqsn5iey5stxvicgxfygfn6mxoy474";
    
    try {
      const response = await fetch(tokenImageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      
      // Get the image data and content type
      const imageBuffer = await response.arrayBuffer();
      const contentType = response.headers.get("content-type") || "image/png";
      
      // Set appropriate headers and send the image
      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.send(Buffer.from(imageBuffer));
    } catch (error) {
      log(`Error fetching token image: ${error}`, "frame-error");
      res.status(500).send("Error fetching token image");
    }
  });
  
  // Purchase confirmation image
  app.get("/api/frame/purchase-confirmation", async (req, res) => {
    const amount = req.query.amount || "0";
    const ethAmount = req.query.ethAmount || "0";
    
    // Create a simple image with text
    res.setHeader("Content-Type", "text/html");
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              width: 1200px;
              height: 628px;
              background: linear-gradient(135deg, #000000, #111111);
              color: white;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              text-align: center;
            }
            .container {
              width: 80%;
              max-width: 800px;
            }
            .token-logo {
              width: 100px;
              height: 100px;
              border-radius: 50%;
              margin-bottom: 20px;
            }
            h1 {
              font-size: 42px;
              margin-bottom: 10px;
            }
            .details {
              background: rgba(255,255,255,0.1);
              border-radius: 12px;
              padding: 20px;
              margin: 20px 0;
              width: 100%;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid rgba(255,255,255,0.1);
            }
            .detail-row:last-child {
              border-bottom: none;
            }
            .label {
              color: rgba(255,255,255,0.7);
            }
            .value {
              font-weight: bold;
            }
            .network {
              background: rgba(255,255,255,0.1);
              border-radius: 20px;
              padding: 5px 15px;
              margin-top: 15px;
              display: inline-block;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <img class="token-logo" src="https://ipfs.io/ipfs/bafkreighrlz43fgcdmqdtyv755zmsqsn5iey5stxvicgxfygfn6mxoy474" alt="$BISOU Token" />
            <h1>Confirm Your Purchase</h1>
            
            <div class="details">
              <div class="detail-row">
                <span class="label">$BISOU Amount:</span>
                <span class="value">${amount} tokens</span>
              </div>
              <div class="detail-row">
                <span class="label">Cost:</span>
                <span class="value">~${ethAmount} ETH</span>
              </div>
            </div>
            
            <div class="network">Base Network</div>
          </div>
        </body>
      </html>
    `);
  });
  
  // Custom amount input image
  app.get("/api/frame/custom-amount", async (req, res) => {
    // Create a simple image with text
    res.setHeader("Content-Type", "text/html");
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              width: 1200px;
              height: 628px;
              background: linear-gradient(135deg, #000000, #111111);
              color: white;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              text-align: center;
            }
            .container {
              width: 80%;
              max-width: 800px;
            }
            .token-logo {
              width: 100px;
              height: 100px;
              border-radius: 50%;
              margin-bottom: 20px;
            }
            h1 {
              font-size: 42px;
              margin-bottom: 10px;
            }
            p {
              font-size: 24px;
              color: rgba(255,255,255,0.7);
              margin-bottom: 20px;
            }
            .input-field {
              background: rgba(255,255,255,0.1);
              border: 2px dashed rgba(255,255,255,0.3);
              border-radius: 12px;
              padding: 20px;
              margin: 20px 0;
              width: 100%;
              font-size: 24px;
              text-align: center;
            }
            .network {
              background: rgba(255,255,255,0.1);
              border-radius: 20px;
              padding: 5px 15px;
              margin-top: 15px;
              display: inline-block;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <img class="token-logo" src="https://ipfs.io/ipfs/bafkreighrlz43fgcdmqdtyv755zmsqsn5iey5stxvicgxfygfn6mxoy474" alt="$BISOU Token" />
            <h1>Enter Custom Amount</h1>
            <p>How many $BISOU tokens would you like to purchase?</p>
            
            <div class="input-field">Enter amount here</div>
            
            <div class="network">Base Network</div>
          </div>
        </body>
      </html>
    `);
  });
  
  // Error image
  app.get("/api/frame/error", async (req, res) => {
    // Create a simple image with text
    res.setHeader("Content-Type", "text/html");
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              width: 1200px;
              height: 628px;
              background: linear-gradient(135deg, #000000, #111111);
              color: white;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              text-align: center;
            }
            .container {
              width: 80%;
              max-width: 800px;
            }
            .token-logo {
              width: 100px;
              height: 100px;
              border-radius: 50%;
              margin-bottom: 20px;
            }
            h1 {
              font-size: 42px;
              margin-bottom: 10px;
              color: #f44336;
            }
            p {
              font-size: 24px;
              color: rgba(255,255,255,0.7);
              margin-bottom: 20px;
            }
            .error-icon {
              font-size: 64px;
              color: #f44336;
              margin-bottom: 20px;
            }
            .network {
              background: rgba(255,255,255,0.1);
              border-radius: 20px;
              padding: 5px 15px;
              margin-top: 15px;
              display: inline-block;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="error-icon">⚠️</div>
            <h1>Invalid Amount</h1>
            <p>Please enter a valid number of tokens greater than zero.</p>
            
            <div class="network">Base Network</div>
          </div>
        </body>
      </html>
    `);
  });

  // Frame action endpoint for handling button clicks
  app.post("/api/frame/action", async (req, res) => {
    try {
      // Validate the incoming frame message
      const result = frameMessageSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid frame message format" });
      }

      const { untrustedData } = result.data;
      const baseUrl = getBaseUrl(req);
      
      // Generate a unique frame ID for this interaction
      const frameId = crypto.randomBytes(16).toString("hex");
      
      // Log the interaction
      await storage.logFrameInteraction({
        frameId,
        fid: untrustedData.fid,
        action: `button_${untrustedData.buttonIndex}`,
        amount: getAmountFromButtonIndex(untrustedData.buttonIndex),
        timestamp: new Date().toISOString()
      });

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
      log(`Error processing frame action: ${error}`, "frame-error");
      return res.status(500).json({ error: "Error processing frame action" });
    }
  });

  // Frontend app
  app.get("/", (req, res) => {
    res.redirect("/app");
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
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
        <meta property="og:description" content="Invalid amount entered" />
      </head>
      <body>
        <h1>Invalid Amount</h1>
        <p>Please enter a valid amount greater than 0</p>
      </body>
    </html>
  `);
}
