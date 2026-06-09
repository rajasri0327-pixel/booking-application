# CineBook - Deployment Guide

This guide covers deployment to Vercel, GitHub Actions, and manual deployment.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- MongoDB Atlas account (for remote database)
- Vercel account (for Vercel deployment)
- GitHub account (for GitHub Actions)

## Environment Variables

Create a `.env` file in the `server` directory with:

```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/cinebook_db
JWT_SECRET=your_jwt_secret_key_here
ADMIN_REGISTRATION_SECRET=your_admin_secret_here
NODE_ENV=production
```

## Local Setup & Manual Deployment

### 1. Install Dependencies

```bash
# From root directory
npm run install-all

# Or manually:
cd server && npm install
cd ../client && npm install
```

### 2. Build the Application

```bash
# Build React frontend
npm --prefix client run build

# This creates a `build` folder in the client directory
```

### 3. Run Locally

```bash
# Development mode (runs both server and client)
npm run dev

# Or run separately:
# Terminal 1 - Backend
npm --prefix server dev

# Terminal 2 - Frontend
npm --prefix client start
```

### 4. Manual Deployment Steps

#### For Ubuntu/Linux Server:

```bash
# SSH into your server
ssh user@your-server-ip

# Clone the repository
git clone https://github.com/your-username/booking-application.git
cd booking-application

# Install dependencies
npm run install-all

# Build the frontend
npm run build

# Set environment variables
export MONGO_URI="your_mongodb_uri"
export JWT_SECRET="your_jwt_secret"
export ADMIN_REGISTRATION_SECRET="your_admin_secret"
export NODE_ENV="production"

# Start the server
npm --prefix server start
```

#### Using PM2 for Process Management:

```bash
# Install PM2 globally
npm install -g pm2

# Start the server with PM2
pm2 start server/server.js --name "cinebook-api"

# Save PM2 configuration
pm2 save

# Set up to start on reboot
pm2 startup
```

---

## Vercel Deployment

### 1. Connect Repository to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### 2. Configure Environment Variables in Vercel Dashboard

- Go to Project Settings → Environment Variables
- Add:
  - `MONGO_URI`: Your MongoDB connection string
  - `JWT_SECRET`: Your JWT secret
  - `ADMIN_REGISTRATION_SECRET`: Your admin registration secret

### 3. Vercel Project Structure

The `vercel.json` file handles:
- Building the React frontend
- Running the Node.js backend
- Routing API requests to `/api/*`
- Serving static frontend files

---

## GitHub Actions Deployment

### 1. Add GitHub Secrets

In your GitHub repository:
- Go to Settings → Secrets and variables → Actions
- Add these secrets:
  - `VERCEL_TOKEN`: Your Vercel API token
  - `VERCEL_ORG_ID`: Your Vercel Organization ID
  - `VERCEL_PROJECT_ID`: Your Vercel Project ID

Get these from:
- Vercel Dashboard → Settings → Tokens (for VERCEL_TOKEN)
- Vercel Dashboard → Project Settings (for ORG_ID and PROJECT_ID)

### 2. The GitHub Actions Workflow

The `.github/workflows/deploy.yml` automatically:
- Triggers on push to `main` or `master`
- Installs dependencies for both server and client
- Builds the React frontend
- Deploys to Vercel using the Vercel action

---

## Troubleshooting

### Issue: "react-scripts: command not found"

**Solution**: Ensure `npm install` runs in the client directory before building:

```bash
cd client
npm install
npm run build
```

### Issue: "MONGO_URI not found"

**Solution**: Make sure environment variables are set:

```bash
# Linux/Mac
export MONGO_URI="your_connection_string"

# Windows PowerShell
$env:MONGO_URI="your_connection_string"
```

### Issue: Port 5000 already in use

**Solution**:
```bash
# Find the process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### Issue: CORS Errors

**Solution**: The server already has CORS enabled. If issues persist, check that:
- Frontend is calling `http://localhost:5000/api/...` (or your deployed backend URL)
- Backend has `CORS_ORIGIN` set correctly

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] MongoDB Atlas connection tested
- [ ] JWT_SECRET is strong and secure
- [ ] Client builds successfully: `npm --prefix client run build`
- [ ] Server starts without errors: `npm --prefix server start`
- [ ] API endpoints respond: `curl http://localhost:5000/api/movies`
- [ ] React frontend loads: Visit `http://localhost:3000` (dev) or served from backend (production)
- [ ] Git repository is up to date before deploying
- [ ] Secrets are set in Vercel dashboard or GitHub Actions

---

## Production Best Practices

1. **Use Environment Variables**: Never commit secrets to git
2. **Enable HTTPS**: Vercel provides free SSL certificates
3. **Monitor Logs**: Use Vercel or PM2 logs for debugging
4. **Database Backups**: Set up MongoDB Atlas automated backups
5. **API Rate Limiting**: Consider adding rate limiting for production
6. **Error Tracking**: Use services like Sentry for error monitoring

---

For more help, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Atlas Guide](https://www.mongodb.com/docs/atlas/)
