# The Pattern Architect (ohmasterylab.io)

Elite algorithmic pattern coach built with React + Vite + Tailwind CSS and powered by Gemini.

## Deploying to Vercel

### 1. Environment Variables in Vercel
In your Vercel Project Settings under **Environment Variables**, add:
- `GEMINI_API_KEY`: Your Google Gemini API key

### 2. Build & Output Settings in Vercel
Vercel automatically detects this setup with the included `vercel.json`:
- **Framework Preset**: Vite
- **Build Command**: `npm run build` (or `vite build`)
- **Output Directory**: `dist`
- **Install Command**: `npm install`

The API routes under `/api/*` are configured as Vercel Serverless Functions (`api/phase1.ts`, `api/phase2-evaluate.ts`, `api/phase3-critique.ts`, `api/socratic-hint.ts`) using `@vercel/node`.
