# Cloudflare Pages + Next.js 15 部署指南

## 問題分析
目前 `linqtw` 項目顯示 Godaddy 默認頁面，因為：
1. Cloudflare Pages 只是上傳了原始文件
2. 沒有正確的構建和運行配置
3. Next.js 需要特殊的處理來在 Cloudflare 邊緣運行

## 解決方案

### 方法 1：使用 Cloudflare Dashboard 配置（推薦）

1. 訪問 https://dash.cloudflare.com/
2. 進入 Pages > linqtw 項目
3. 進入 **Settings > Build and Deployments**
4. 配置以下內容：
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
   - **Root directory**: (留空)
   - **Node version**: 20

5. 保存並重新部署

### 方法 2：使用 Git 連接（更簡單）

1. 將代碼推送到 GitHub（如果還沒有）
2. 在 Cloudflare Pages 中連接 GitHub 倉庫
3. Pages 會自動檢測 Next.js 並配置正確的構建設置
4. 每次 git push 時自動部署

### 方法 3：在本地手動部署（當前使用）

```powershell
# 執行以下命令來部署
npm run build
npx wrangler pages deploy . --project-name linqtw --commit-dirty=true
```

## 注意事項
- 後端 API 路由（/api/*）需要 Node.js 支持
- Cloudflare Pages 現在支持 Node.js，但需要正確的構建配置
- 如果只想部署純前端，可以使用 `next export`

## 下一步

請進入 Cloudflare Dashboard 完成方法 1 的配置，這樣 Pages 就會知道如何正確運行你的 Next.js 應用。
