# $BISOU Warpcast Mini App

A Warpcast mini app that allows users to purchase $BISOU tokens on Base network through a DEX interface.

## Features

- Frame-enabled for Warpcast interaction
- Purchase options for preset amounts (50, 250, 500 $BISOU)
- Custom amount purchase option
- Database storage for frame interactions
- Responsive web interface

## Deployment to Vercel

Follow these steps to deploy this app to Vercel:

### Prerequisites

1. A [Vercel](https://vercel.com) account
2. A PostgreSQL database (e.g., Neon, Supabase, Vercel Postgres)

### Deploy Steps

1. **Fork or clone this repository**

2. **Configure your database**
   - Create a PostgreSQL database
   - Note your database connection string (DATABASE_URL)

3. **Deploy to Vercel**
   - Import your repository in Vercel
   - Add the following environment variables in Vercel:
     - `DATABASE_URL`: Your PostgreSQL database URL
     - `NODE_ENV`: Set to `production`

4. **Run database migrations**
   - After deployment, run database migrations using Vercel CLI:
   ```bash
   vercel env pull .env.local  # Pull environment variables
   npx tsx scripts/db-push.ts  # Run migrations
   ```

5. **Your app is now live!**
   - Vercel will provide a URL for your app (e.g., `your-app.vercel.app`)
   - Test your frame by sharing the URL in a Warpcast cast: `https://your-app.vercel.app/api/frame`

### Testing the Frame

To test if your Frame is working correctly:
1. Visit https://warpcast.com/~/developers/frames
2. Input your frame URL: `https://your-app.vercel.app/api/frame`
3. Test the interactions with the Warpcast Frame validator

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`:
   ```
   DATABASE_URL=your_postgres_connection_string
   ```
4. Start the development server: `npm run dev`
5. Open http://localhost:5000

## Technology Stack

- Frontend: React, TypeScript, TailwindCSS, shadcn/ui
- Backend: Express.js, Node.js
- Database: PostgreSQL with Drizzle ORM
- Deployment: Vercel