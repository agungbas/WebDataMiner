// Specialized handler for the error frame
import type { Request, Response } from 'express';

// This handler specifically handles the /api/frame/error route
export default async function handler(req: Request, res: Response) {
  // Create a simple HTML with an error message
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
}