# Quick Deployment Reference

## Files Created for Deployment

✅ **`vercel.json`** - Vercel configuration for frontend + backend deployment
✅ **`.github/workflows/deploy.yml`** - GitHub Actions CI/CD pipeline
✅ **`package.json`** (root) - Root-level scripts for managing both client and server
✅ **`DEPLOYMENT.md`** - Complete deployment guide
✅ **`.gitignore`** - Prevents node_modules and env files from being committed

## Quick Start

### Install Everything
```bash
npm run install-all
```

### Run Locally
```bash
npm run dev
```

### Build for Production
```bash
npm run build-all
```

## Deployment Steps

### 1. **Manual Deployment** (Linux/Ubuntu Server)
```bash
git clone <your-repo>
cd booking-application
npm run install-all
npm run build
NODE_ENV=production \
MONGO_URI="<your-uri>" \
JWT_SECRET="<your-secret>" \
npm --prefix server start
```

### 2. **Vercel Deployment**
```bash
npm install -g vercel
vercel login
vercel --prod
```

Then set environment variables in Vercel Dashboard.

### 3. **GitHub Actions** (Automatic)
Push to `main` or `master` branch → GitHub Actions builds → Deploys to Vercel

## What Changed

| File | Purpose |
|------|---------|
| `vercel.json` | Routes API to backend, static files to frontend |
| `.github/workflows/deploy.yml` | Auto-deploys on git push |
| `package.json` (root) | Unified scripts for both apps |
| `.gitignore` | Prevents committing node_modules and secrets |

## Fix for "react-scripts: command not found"

The error happened because `npm install` wasn't running in the build environment.

**Now fixed by:**
- ✅ Root `package.json` with install scripts
- ✅ GitHub Actions runs `npm ci` before build
- ✅ Vercel config ensures dependencies install

## Environment Variables to Set

Before deploying, set these in your deployment platform:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/cinebook_db
JWT_SECRET=your_strong_secret_key
ADMIN_REGISTRATION_SECRET=your_admin_key
NODE_ENV=production
```

## Verify It Works

After deployment, test:

```bash
# Frontend
curl https://your-domain.vercel.app

# Backend API
curl https://your-domain.vercel.app/api/movies
```

---

**See `DEPLOYMENT.md` for detailed instructions.**
