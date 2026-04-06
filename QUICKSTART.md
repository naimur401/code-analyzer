# Quick Start Guide - CodeAnalyzer

Get CodeAnalyzer running in 10 minutes!

## Prerequisites Checklist

- [ ] Node.js 18+ installed (`node --version`)
- [ ] GitHub account with OAuth app created
- [ ] MongoDB Atlas account (free tier)
- [ ] Redis instance (Upstash or local)
- [ ] Ollama installed with Llama2 model

## Step 1: Setup (2 minutes)

### Clone or Download
```bash
# If cloning from git
git clone https://github.com/yourusername/codeanalyzer.git
cd codeanalyzer
```

### Install Dependencies
```bash
# Frontend
pnpm install

# Backend
cd backend
pnpm install
cd ..
```

## Step 2: Environment Variables (2 minutes)

### Frontend Setup
```bash
# Copy template
cp .env.local.example .env.local

# Edit with your values
# NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
# NEXT_PUBLIC_BACKEND_URL=http://localhost:5000/api
```

### Backend Setup
```bash
cd backend
cp .env.example .env

# Edit with your values:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/code-analysis
# REDIS_URL=redis://default:password@host:6379
# GITHUB_CLIENT_ID=your_github_client_id
# GITHUB_CLIENT_SECRET=your_github_client_secret
# OLLAMA_API_URL=http://localhost:11434
# JWT_SECRET=your_jwt_secret_key_here
```

## Step 3: Start Services (4 minutes)

### Terminal 1: Start Frontend
```bash
pnpm dev
# Runs on http://localhost:3000
```

### Terminal 2: Start Backend
```bash
cd backend
pnpm run dev
# Runs on http://localhost:5000
```

### Terminal 3: Start Ollama (if not already running)
```bash
ollama serve
# Ollama API on http://localhost:11434
```

### Terminal 4: Start Redis (optional, if using local Redis)
```bash
redis-server
# Redis on localhost:6379
```

## Step 4: Login & Test (2 minutes)

1. Open http://localhost:3000 in your browser
2. Click "Sign In with GitHub"
3. Authorize the app
4. You'll be redirected to dashboard

## First Test

1. Go to Dashboard → Repositories
2. Click "Refresh" to load GitHub repos
3. Click "Add" on any repository
4. Go to Dashboard → Analysis
5. Select the repository
6. Click "Start Analysis"
7. Watch the progress in real-time!

## Troubleshooting

### "Cannot find module" errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
pnpm install
```

### Backend won't start
```bash
# Check MongoDB connection
# Check Redis is running
# Check Ollama is serving
ollama ps
```

### OAuth fails
- Verify GitHub Client ID in .env.local
- Check GitHub OAuth app redirect URL matches your setup
- Clear browser cookies/cache

### Analysis won't start
- Check backend logs for errors
- Verify MongoDB and Redis are connected
- Check Ollama model is available: `ollama list`

## Next Steps

- [ ] Read [README.md](./README.md) for full documentation
- [ ] Review [INFRASTRUCTURE_SETUP.md](./INFRASTRUCTURE_SETUP.md) for detailed setup
- [ ] Deploy to production using [DEPLOYMENT.md](./DEPLOYMENT.md)
- [ ] Configure GitHub webhooks for auto-analysis
- [ ] Set up notifications
- [ ] Create teams (feature coming soon)

## Project Structure Quick Reference

```
codeanalyzer/
├── app/                    # Next.js pages
├── components/             # React components  
├── lib/                    # Utilities, types, API
├── hooks/                  # Custom React hooks
├── backend/
│   ├── src/
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API endpoints
│   │   ├── services/      # Business logic
│   │   ├── workers/       # Job processors
│   │   └── index.ts       # Express server
│   └── package.json
├── README.md              # Full documentation
├── INFRASTRUCTURE_SETUP.md # Setup guide
├── DEPLOYMENT.md          # Production guide
└── QUICKSTART.md          # This file!
```

## Key Endpoints

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health
- **MongoDB**: Check Atlas dashboard
- **Redis**: localhost:6379

## Common Commands

```bash
# Frontend
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run linter

# Backend
pnpm dev          # Start with hot reload
pnpm build        # Build TypeScript
pnpm start        # Run compiled code
npm run lint      # Run linter

# Ollama
ollama serve      # Start Ollama
ollama list       # List models
ollama pull llama2 # Download model
```

## Performance Tips

1. **Analysis Speed**: First analysis takes longer (LLM cold start)
2. **Repository Size**: Larger repos take longer to analyze
3. **Concurrency**: Process multiple repos sequentially to save resources
4. **LLM Model**: Llama2 is default, consider Mistral or Neural Chat for faster performance

## Getting Help

1. Check [README.md](./README.md) FAQ section
2. Review error logs in terminal
3. Check backend logs: `cd backend && pnpm run dev`
4. Verify all services are running and connected

## What's Included

✅ Full-stack TypeScript application  
✅ GitHub OAuth authentication  
✅ MongoDB database integration  
✅ Redis job queue system  
✅ AI-powered code analysis with local LLM  
✅ Security vulnerability scanning  
✅ Real-time WebSocket updates  
✅ Professional dashboard UI  
✅ Fully documented API  
✅ Docker & deployment configs  

## Example Workflow

1. **Add Repository**: Browse GitHub repos, add to system
2. **Trigger Analysis**: Start analysis job (queued in Redis)
3. **Monitor Progress**: Watch real-time updates via WebSocket
4. **View Results**: See metrics, insights, recommendations
5. **Compare Repos**: Side-by-side comparison of metrics
6. **Check Security**: View vulnerabilities and fixes

---

**You're all set! Start exploring CodeAnalyzer.** 🚀

For detailed information, see [README.md](./README.md)
