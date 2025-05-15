// Specialized handler for the frame image API endpoint
import type { Request, Response } from 'express';

// This handler specifically handles the /api/frame/image route
export default async function handler(req: Request, res: Response) {
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
    console.error(`Error fetching token image:`, error);
    res.status(500).send("Error fetching token image");
  }
}