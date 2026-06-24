# Cloudflare Pages Deploy Script for Windows
# This script prepares the .next output for Cloudflare Pages deployment

Write-Output "🚀 準備上傳到 Cloudflare Pages..."

# Step 1: Build the project
Write-Output "📦 Building Next.js project..."
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Output "❌ Build failed!"
    exit 1
}

# Step 2: Deploy to Cloudflare Pages
Write-Output "🌐 Uploading to Cloudflare Pages..."

# Get account ID from wrangler if not set
$accountId = (npx wrangler whoami 2>$null | Select-String "Account ID" | Select-Object -ExpandProperty Line)

if (-not $accountId) {
    Write-Output "⚠️  Please ensure you're logged in: npx wrangler login"
    exit 1
}

# Deploy using wrangler pages deploy
# Note: deploying the .next directory with the proper structure
npx wrangler pages deploy . `
    --project-name linqtw `
    --branch main `
    --compatibility-date 2026-06-17

if ($LASTEXITCODE -eq 0) {
    Write-Output "✅ Successfully deployed to Cloudflare Pages!"
    Write-Output "🎉 Your site is live at: https://linqtw.pages.dev"
} else {
    Write-Output "❌ Deployment failed!"
    exit 1
}
