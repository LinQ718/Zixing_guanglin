# PowerShell script to deploy frontend to Cloudflare Pages
# Run: .\deploy-frontend.ps1

Write-Output "🔨 Building frontend..."
npm run build

Write-Output "📦 Preparing frontend deployment..."
$deployDir = ".deploy"
if (Test-Path $deployDir) {
    Remove-Item $deployDir -Recurse -Force
}
New-Item -ItemType Directory -Path $deployDir | Out-Null

# Copy static files
if (Test-Path ".next") {
    Copy-Item ".next/*" $deployDir -Recurse -Force
}
if (Test-Path "public") {
    Copy-Item "public/*" "$deployDir/public" -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Output "🚀 Deploying to Cloudflare Pages..."
npx wrangler pages deploy $deployDir --project-name linqtw --commit-dirty=true

Write-Output "✨ Frontend deployed! Visit:"
Write-Output "   Production: https://linqtw.pages.dev"
Write-Output "   Latest: https://main.linqtw.pages.dev"
