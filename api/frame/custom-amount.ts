// Specialized handler for the custom amount frame
import type { Request, Response } from 'express';

// This handler specifically handles the /api/frame/custom-amount route
export default async function handler(req: Request, res: Response) {
  // Create a simple HTML with custom amount input
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
}