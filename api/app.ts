// Handler for the main app route
import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export default function handler(req: Request, res: Response) {
  // For Vercel, we need to serve the app HTML
  try {
    // In production, we would serve the built index.html
    // But for simplicity in this example, we're serving a minimal HTML template
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>$BISOU Token</title>
          <meta name="description" content="Purchase $BISOU tokens on Base network" />
          
          <!-- App styles -->
          <style>
            body {
              margin: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
                'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                sans-serif;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
              background-color: #000;
              color: #fff;
            }
            #root {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              padding: 20px;
              text-align: center;
            }
            h1 {
              font-size: 2.5rem;
              margin-bottom: 1rem;
              background: linear-gradient(90deg, #ff8a00, #e52e71);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            p {
              margin-bottom: 2rem;
              max-width: 600px;
            }
            .card {
              background: rgba(255, 255, 255, 0.05);
              border-radius: 8px;
              padding: 20px;
              max-width: 500px;
              width: 100%;
              margin-bottom: 20px;
            }
            .token-info {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 20px;
            }
            .token-image {
              width: 80px;
              height: 80px;
              border-radius: 50%;
              margin-right: 20px;
            }
            .token-details {
              text-align: left;
            }
            .token-name {
              font-size: 1.5rem;
              font-weight: bold;
              margin: 0;
            }
            .token-network {
              font-size: 0.9rem;
              color: #aaa;
              margin: 0;
            }
            .purchase-options {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
              margin-bottom: 20px;
            }
            .purchase-button {
              background: linear-gradient(90deg, #ff8a00, #e52e71);
              border: none;
              border-radius: 8px;
              padding: 12px;
              color: white;
              font-weight: bold;
              cursor: pointer;
              transition: opacity 0.2s;
            }
            .purchase-button:hover {
              opacity: 0.9;
            }
            .custom-amount {
              display: flex;
              margin-top: 10px;
            }
            .custom-input {
              flex: 1;
              padding: 10px;
              border: 1px solid rgba(255, 255, 255, 0.2);
              border-radius: 8px 0 0 8px;
              background: rgba(255, 255, 255, 0.05);
              color: white;
            }
            .custom-button {
              padding: 10px 15px;
              background: linear-gradient(90deg, #ff8a00, #e52e71);
              border: none;
              border-radius: 0 8px 8px 0;
              color: white;
              font-weight: bold;
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <div id="root">
            <div class="card">
              <div class="token-info">
                <img class="token-image" src="https://ipfs.io/ipfs/bafkreighrlz43fgcdmqdtyv755zmsqsn5iey5stxvicgxfygfn6mxoy474" alt="$BISOU Token" />
                <div class="token-details">
                  <h2 class="token-name">$BISOU Token</h2>
                  <p class="token-network">Base Network</p>
                </div>
              </div>
              
              <h1>Purchase $BISOU Tokens</h1>
              <p>Choose an amount of $BISOU tokens to purchase on the Base network.</p>
              
              <div class="purchase-options">
                <button class="purchase-button">Buy 50 $BISOU</button>
                <button class="purchase-button">Buy 250 $BISOU</button>
                <button class="purchase-button">Buy 500 $BISOU</button>
                <button class="purchase-button">Buy 1000 $BISOU</button>
              </div>
              
              <div class="custom-amount">
                <input type="number" class="custom-input" placeholder="Custom amount" />
                <button class="custom-button">Buy</button>
              </div>
            </div>
            
            <p>This is a serverless version of the $BISOU purchase app running on Vercel.</p>
            <p>For the full experience, please visit the API endpoint at <a href="/api/frame" style="color: #ff8a00;">/api/frame</a></p>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error serving app HTML:', error);
    res.status(500).send('Error loading the application');
  }
}