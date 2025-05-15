import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic, log } from "./vite";
import { createServer } from "http";

// Initialize express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

// Create HTTP server
const server = createServer(app);

// Register API routes
registerRoutes(app).then(async (server) => {
  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    console.error(err);
  });

  // In development, set up Vite for the frontend
  if (process.env.NODE_ENV === 'development') {
    const { setupVite } = await import('./vite');
    await setupVite(app, server);
  }
  // Serve static files in production
  else if (process.env.NODE_ENV === 'production') {
    serveStatic(app);
  }

  // Catch-all handler for SPA routes (if not caught by Vite in development)
  app.use('*', (req, res) => {
    // Skip API routes
    if (req.baseUrl.startsWith('/api')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    // Ensure main app routes work for SPA
    if (process.env.NODE_ENV === 'development') {
      res.redirect('/');
    } else {
      // For production, we should have already handled this with serveStatic
      res.status(404).send('Not found');
    }
  });

  // Start server in local development (not in Vercel)
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const port = process.env.PORT || 5000;
    server.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  }
}).catch(err => {
  console.error("Failed to register routes:", err);
});

// Export for serverless environments
export default app;
