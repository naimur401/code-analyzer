# Deployment Guide - CodeAnalyzer

This guide covers deploying CodeAnalyzer to production environments.

## Architecture Overview

```
┌─────────────────┐
│   Vercel        │
│  (Frontend)     │
└────────┬────────┘
         │ HTTPS
         │
┌────────▼────────────────┐
│   Railway/Fly.io        │
│  (Backend - Express)    │
└────────┬────────────────┘
         │
    ┌────┴─────┬──────────┬─────────┐
    │           │          │         │
┌───▼──┐ ┌─────▼──┐ ┌─────▼──┐ ┌──▼────┐
│  DB  │ │ Redis  │ │ Ollama │ │ GitHub│
│ Mongo│ │ Upstash│ │ Local  │ │ OAuth │
└──────┘ └────────┘ └────────┘ └───────┘
```

## Frontend Deployment (Vercel)

### 1. Prepare Repository
```bash
# Push your code to GitHub
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select root directory (default is fine)
5. Click "Deploy"

### 3. Configure Environment Variables
In Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_BACKEND_URL=https://your-backend.railway.app/api
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
```

Update GitHub OAuth Redirect URL:
1. Go to GitHub Settings → Developer Settings → OAuth Apps
2. Update "Authorization callback URL" to `https://your-vercel-domain.vercel.app/auth/callback`

### 4. Deploy
```bash
# Every git push to main will auto-deploy
git push origin main
```

## Backend Deployment (Railway)

### 1. Prepare Docker Image
```bash
cd backend

# Test Docker build locally
docker build -t codeanalyzer-backend .

# Tag for Railway
docker tag codeanalyzer-backend:latest your-railway-app:latest
```

### 2. Deploy to Railway

**Option A: Using Railway CLI**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Create new service
railway service add

# Deploy
railway up
```

**Option B: Using GitHub Integration**
1. Go to [railway.app](https://railway.app)
2. Create new project
3. Connect GitHub repository
4. Select Dockerfile
5. Configure environment variables (below)
6. Deploy

### 3. Configure Environment Variables
In Railway Dashboard → Variables:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/code-analysis
REDIS_URL=redis://default:password@host.upstash.io:port
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=llama2
JWT_SECRET=generate_strong_random_secret
FRONTEND_URL=https://your-vercel-domain.vercel.app
BACKEND_URL=https://your-railway-app.railway.app
```

### 4. Domain Configuration
1. Go to Railway Dashboard → Plugins → Custom Domain
2. Add your domain (e.g., api.yourdomain.com)
3. Update DNS records as instructed
4. Update FRONTEND_URL in Vercel and BACKEND_URL in Railway

## Database Setup (MongoDB Atlas)

### 1. Create Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create new project
3. Create M0 (free) cluster
4. Choose cloud provider and region
5. Wait for cluster to initialize

### 2. Security Setup
1. Go to Security → Database Access
2. Create database user (username/password)
3. Go to Network Access
4. Add IP address 0.0.0.0/0 (or your server IPs for better security)
5. Go to Databases
6. Click Connect
7. Choose "Connect your application"
8. Copy connection string: `mongodb+srv://username:password@cluster.mongodb.net/mydb?retryWrites=true&w=majority`

### 3. Create Database
1. Go to Databases
2. Click "Create Database"
3. Database name: `code-analysis`
4. Collection name: `users` (others will be auto-created)

## Cache Setup (Upstash Redis)

### 1. Create Redis Database
1. Go to [upstash.com](https://upstash.com)
2. Create new database
3. Choose region closest to your backend
4. Copy connection string: `redis://default:password@host:port`

### 2. Configure in Backend
Use the Redis URL in your environment variables

## LLM Setup (Ollama)

### Option A: Local Machine (Recommended for Development)
1. Install [Ollama](https://ollama.ai)
2. Run: `ollama pull llama2`
3. Start: `ollama serve`
4. Backend should connect to `http://localhost:11434`

### Option B: Remote Server (Production)
```bash
# On your server
ssh user@your-server.com

# Install Ollama
curl https://ollama.ai/install.sh | sh

# Download model
ollama pull llama2

# Start Ollama service
ollama serve &

# Make accessible (optional, for development only)
# Don't expose to internet in production!
```

For production, consider using a dedicated Ollama API service or GPU-accelerated instance.

## GitHub OAuth Setup

### 1. Create OAuth App
1. Go to [GitHub Settings → Developer Settings](https://github.com/settings/developers)
2. Create new OAuth App
3. Fill in details:
   - Application name: CodeAnalyzer
   - Homepage URL: https://your-domain.com
   - Authorization callback URL: https://your-domain.com/auth/callback
4. Copy Client ID and Client Secret

### 2. Update in Services
- Add to Vercel environment: `NEXT_PUBLIC_GITHUB_CLIENT_ID`
- Add to Railway environment: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`

## CI/CD Pipeline (GitHub Actions)

### 1. Create Workflow File
```bash
mkdir -p .github/workflows
touch .github/workflows/deploy.yml
```

### 2. Add Deployment Workflow
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: |
          npm i -g @railway/cli
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

## Monitoring & Logging

### 1. Vercel Monitoring
- Dashboard: https://vercel.com/dashboard
- View logs: Deployment → Functions
- Analytics: Available in Pro plan

### 2. Railway Monitoring
- Dashboard: https://railway.app
- View logs: Services → Logs
- Metrics: CPU, Memory, Network

### 3. MongoDB Monitoring
- Atlas dashboard: https://cloud.mongodb.com
- Charts: Performance, Operations
- Alerts: Configure in Settings

## Scaling Considerations

### Backend Scaling
1. **Horizontal**: Railway auto-scales with multiple instances
2. **Vertical**: Upgrade Railway plan for more resources
3. **Caching**: Use Redis more aggressively
4. **Database**: Upgrade MongoDB cluster tier

### Job Processing
1. **Multiple Workers**: Deploy separate worker instances
2. **Job Priorities**: Implement queue priorities
3. **Rate Limiting**: Add rate limiting middleware

### Frontend Optimization
1. **CDN**: Vercel includes CDN
2. **Edge Functions**: Use Vercel Edge Middleware
3. **Caching**: Configure cache headers

## Troubleshooting

### Backend Not Connecting
```bash
# Test backend health
curl https://your-backend.railway.app/health

# Check logs
railway logs -t error
```

### Analysis Jobs Failing
```bash
# Check job queue
# In backend, connect to Redis:
redis-cli
> KEYS *
> HGETALL bull:analysis:*

# Check MongoDB
# In MongoDB Atlas console, view collections
```

### Performance Issues
1. Check database indexes in MongoDB
2. Monitor Redis memory usage
3. Check backend CPU/memory in Railway
4. Optimize LLM model size (consider smaller models)

## Security Best Practices

1. **Environment Variables**: Never commit secrets
2. **Database**: Enable IP whitelisting in MongoDB
3. **Redis**: Use password authentication
4. **Backend**: Use HTTPS only
5. **Secrets**: Rotate tokens regularly
6. **CORS**: Configure properly in production
7. **Rate Limiting**: Implement on API endpoints

## Cost Optimization

- **MongoDB**: Use M0 free tier or shared cluster
- **Redis**: Upstash free tier (10GB)
- **Backend**: Railway free tier includes $5 credit
- **Frontend**: Vercel free tier for hobby projects
- **Ollama**: Self-hosted = cheaper than cloud APIs

## Rollback Procedure

### Vercel
```bash
# Go to Deployments tab
# Click "..." on previous deployment
# Select "Promote to Production"
```

### Railway
```bash
# Go to Deployments
# Click on previous deployment
# Click "Redeploy"
```

## Support & Issues

- GitHub Issues: Report bugs
- Documentation: Check README.md
- Email: support@yourapp.com

For production issues, prioritize:
1. Database connectivity
2. Job queue status
3. LLM service availability
4. GitHub API limits
