# 🚀 Simple Deployment Guide

## Option 1: Deploy with Vercel CLI (Easiest)

1. **First-time setup:**
   ```bash
   cd website-builder
   vercel
   ```
   - Follow the prompts
   - Link to your Vercel account
   - Choose project name

2. **Deploy to production:**
   ```bash
   vercel --prod
   ```

3. **Set environment variable in Vercel Dashboard:**
   - Go to your project settings
   - Add: `ANTHROPIC_API_KEY` = your Claude API key

## Option 2: Deploy via GitHub (Current Setup)

Your repo is already connected. Just push changes:
```bash
git add .
git commit -m "Update"
git push origin main
```

## Option 3: One-Click Deploy

1. Run the PowerShell script:
   ```powershell
   .\deploy.ps1
   ```

## Environment Variables Required

Add these in Vercel Dashboard → Settings → Environment Variables:

- `ANTHROPIC_API_KEY` - Your Claude API key (required for AI features)

## Troubleshooting

If you get build errors:

1. **Clear cache:**
   ```bash
   rm -rf .next node_modules
   npm install
   npm run build
   ```

2. **Check locally first:**
   ```bash
   npm run build
   npm run start
   ```

3. **Use development deployment:**
   ```bash
   vercel
   ```

## Database

The app uses SQLite locally. In production, Vercel will use the included database file.
For production use, consider migrating to PostgreSQL or MySQL.

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs