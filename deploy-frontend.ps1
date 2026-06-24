# PowerShell script to deploy 自性光林 frontend to Cloudflare Pages
# This uses Next.js static export for pure frontend deployment
# Run: .\deploy-frontend.ps1

Write-Output "🔨 Building 自性光林 frontend (static export)..."
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Output "❌ Build failed!"
    exit 1
}

Write-Output "📦 Checking export output..."
if (Test-Path "out") {
    Write-Output "✓ Found out/ directory"
    $fileCount = (Get-ChildItem -Path "out" -Recurse -File).Count
    Write-Output "  Total files: $fileCount"
} else {
    Write-Output "⚠️  out/ directory not found. Creating from .next..."
}

Write-Output "🚀 Deploying 自性光林 frontend to Cloudflare Pages..."
npx wrangler pages deploy out --project-name linqtw --commit-dirty=true

if ($LASTEXITCODE -eq 0) {
    Write-Output ""
    Write-Output "✨ 自性光林 frontend deployed successfully!"
    Write-Output ""
    Write-Output "🌐 Access your site at:"
    Write-Output "   📍 Production: https://linqtw.pages.dev"
    Write-Output "   📍 Main branch: https://main.linqtw.pages.dev"
    Write-Output ""
    Write-Output "⏱️  Please wait a few seconds for the CDN to update (usually 30-60 seconds)"
} else {
    Write-Output "❌ Deployment failed!"
    exit 1
}
