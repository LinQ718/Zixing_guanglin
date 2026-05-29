This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Cloudflare R2 Upload Setup

This project includes an admin upload flow that sends images directly to Cloudflare R2 through a presigned URL.

### 1) Environment variables

Copy `.env.example` to `.env.local` and fill these values:

- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET`
- `R2_PUBLIC_BASE_URL` (optional, recommended for public image delivery)

Admin auth variables are also required:

- `ADMIN_USER`
- `ADMIN_PASS`
- `ADMIN_SESSION_SECRET`

Cloudflare dashboard mapping:

- `R2_ACCOUNT_ID`: Cloudflare account ID
- `R2_ACCESS_KEY_ID`: R2 API token access key
- `R2_SECRET_ACCESS_KEY`: R2 API token secret key
- `R2_BUCKET`: your bucket name (for this project default can be `zixing-images`)
- `R2_PUBLIC_BASE_URL`: optional public domain (example: `https://images.yourdomain.com`)

### 2) API route used by admin upload

- `POST /api/admin/upload/presign`

If R2 env is not complete, upload API automatically falls back to local upload mode.

R2 status check endpoint:

- `GET /api/admin/upload/status`
- Returns `configured`, `mode`, and `missingKeys` for quick troubleshooting.

The route validates admin session, verifies image type/size, and returns a short-lived upload URL for R2.

### 3) Admin upload UI

Image fields in these pages now upload directly to R2:

- `/admin/products`
- `/admin/lantern-sea`
- `/admin/courses`
- `/admin/notifications`

## Firestore Data Architecture

All admin and public content now reads/writes through Firestore (no static in-page data source).

Required collections:

- `products`
- `courses`
- `notices`
- `lamp_sea`
- `members`
- `practice_logs`

API routes:

- Admin CRUD: `/api/admin/[entity]`, `/api/admin/[entity]/[id]`
- Admin dashboard: `/api/admin/dashboard`
- Public read: `/api/public/[entity]`

Where `entity` can be one of:

- `products`
- `courses`
- `notices`
- `lamp_sea`
- `members`
- `practice_logs`
