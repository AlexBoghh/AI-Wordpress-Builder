# Simple Vercel Deployment Script for Windows

Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Cyan

# Navigate to website-builder directory
Set-Location -Path "E:\My Web Projects\Website Builder 3.0\website-builder"

# Deploy to Vercel (production)
Write-Host "Deploying to production..." -ForegroundColor Yellow
vercel --prod

Write-Host "✅ Deployment complete!" -ForegroundColor Green