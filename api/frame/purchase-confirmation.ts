// Specialized handler for the purchase confirmation image
import type { Request, Response } from 'express';

// This handler specifically handles the /api/frame/purchase-confirmation route
export default async function handler(req: Request, res: Response) {
  const amount = req.query.amount || "0";
  const ethAmount = req.query.ethAmount || "0";
  
  // Create a simple HTML with token purchase confirmation
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
}