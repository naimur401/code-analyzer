# CodeAnalyzer Setup Checklist

Track your progress setting up CodeAnalyzer with this comprehensive checklist.

## Phase 1: Prerequisites (15 min)

### Development Tools
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm/pnpm installed (`pnpm --version`)
- [ ] Git installed (`git --version`)
- [ ] Terminal/Command line ready
- [ ] Text editor or IDE ready

### External Services
- [ ] GitHub account created
- [ ] MongoDB Atlas account created (free tier)
- [ ] Redis service set up (Upstash or local)
- [ ] Ollama downloaded and installed
- [ ] Ollama model downloaded (`ollama pull llama2`)

### GitHub OAuth App
- [ ] GitHub OAuth App created
- [ ] Client ID copied
- [ ] Client Secret copied
- [ ] Redirect URL set to `http://localhost:3000/auth/callback`

### MongoDB Setup
- [ ] Cluster created
- [ ] Database user created
- [ ] IP whitelist configured (0.0.0.0/0 for dev)
- [ ] Connection string copied

### Redis Setup
- [ ] Redis instance created/running
- [ ] Connection URL available
- [ ] Redis running and accessible (test: `redis-cli ping`)

## Phase 2: Local Setup (20 min)

### Project Preparation
- [ ] Project downloaded/cloned
- [ ] Opened in text editor
- [ ] Verified all main folders present
- [ ] Verified backend folder exists

### Frontend Setup
- [ ] Installed dependencies: `pnpm install`
- [ ] Created `.env.local` file
- [ ] Added `NEXT_PUBLIC_GITHUB_CLIENT_ID`
- [ ] Added `NEXT_PUBLIC_BACKEND_URL=http://localhost:5000/api`
- [ ] Verified `.env.local` is in `.gitignore`

### Backend Setup
- [ ] Navigated to `/backend` directory
- [ ] Installed dependencies: `pnpm install`
- [ ] Created `.env` file
- [ ] Added `MONGODB_URI`
- [ ] Added `REDIS_URL`
- [ ] Added `GITHUB_CLIENT_ID`
- [ ] Added `GITHUB_CLIENT_SECRET`
- [ ] Added `OLLAMA_API_URL=http://localhost:11434`
- [ ] Added `OLLAMA_MODEL=llama2`
- [ ] Added `JWT_SECRET` (random strong string)
- [ ] Verified `.env` is in `.gitignore`

## Phase 3: Service Startup (10 min)

### Start Terminal Sessions

**Terminal 1: Ollama**
- [ ] Started Ollama service: `ollama serve`
- [ ] Verified on http://localhost:11434
- [ ] Verified model available: `ollama list`

**Terminal 2: Redis (if local)**
- [ ] Started Redis: `redis-server`
- [ ] Verified connection: `redis-cli ping` → "PONG"
- [ ] Keep running in background

**Terminal 3: Backend**
- [ ] Navigated to `/backend`
- [ ] Started: `pnpm run dev`
- [ ] Verified health endpoint: http://localhost:5000/health
- [ ] Keep running in background

**Terminal 4: Frontend**
- [ ] Navigated to project root
- [ ] Started: `pnpm dev`
- [ ] Verified loaded: http://localhost:3000
- [ ] Keep running in background

## Phase 4: Authentication Test (5 min)

### GitHub OAuth Flow
- [ ] Opened http://localhost:3000
- [ ] Clicked "Sign In with GitHub"
- [ ] Authorized app on GitHub
- [ ] Redirected back to app
- [ ] Saw dashboard/welcome page
- [ ] Verified user info displayed
- [ ] Logged into account successfully

## Phase 5: Core Features Test (15 min)

### Repository Management
- [ ] Navigated to Repositories page
- [ ] Clicked "Refresh" to load GitHub repos
- [ ] Saw GitHub repositories listed
- [ ] Clicked "Add" on a test repository
- [ ] Repository added successfully
- [ ] Saw it in saved repositories

### Code Analysis
- [ ] Navigated to Analysis page
- [ ] Selected a repository
- [ ] Clicked "Start Analysis"
- [ ] Saw job started (pending status)
- [ ] Waited for analysis to complete
- [ ] Viewed analysis results
- [ ] Saw metrics (score, complexity, etc.)
- [ ] Read insights and recommendations

### Security Scanning
- [ ] Navigated to Security page
- [ ] Selected a repository
- [ ] Saw sample vulnerabilities (mocked)
- [ ] Reviewed security findings

### Settings
- [ ] Opened Settings page
- [ ] Saw user information displayed
- [ ] Viewed notification options
- [ ] Logged out successfully
- [ ] Confirmed redirect to home page

## Phase 6: Database Verification (5 min)

### MongoDB Inspection
- [ ] Opened MongoDB Atlas dashboard
- [ ] Found `code-analysis` database
- [ ] Verified `users` collection has entries
- [ ] Verified `repositories` collection has entries
- [ ] Verified `codeanalyses` collection exists
- [ ] Checked document structure looks correct

### Redis Inspection
- [ ] Connected to Redis: `redis-cli`
- [ ] Checked keys: `KEYS *`
- [ ] Verified queue data present
- [ ] Verified session/auth data present
- [ ] Exited Redis CLI

## Phase 7: API Testing (10 min)

### Test Endpoints
- [ ] Health check: `curl http://localhost:5000/health`
- [ ] API status: `curl http://localhost:5000/api/status`
- [ ] Get user: `curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/auth/me`
- [ ] List repos: `curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/repositories`

### WebSocket Testing (Optional)
- [ ] Open browser DevTools → Network → WS
- [ ] Start an analysis
- [ ] Observe WebSocket messages
- [ ] See job progress updates
- [ ] Confirm connection closes on completion

## Phase 8: Documentation Review (10 min)

### Read Essential Docs
- [ ] Read [QUICKSTART.md](./QUICKSTART.md)
- [ ] Read [README.md](./README.md) overview
- [ ] Review [INFRASTRUCTURE_SETUP.md](./INFRASTRUCTURE_SETUP.md) for details
- [ ] Skimmed [DEPLOYMENT.md](./DEPLOYMENT.md) for future reference
- [ ] Reviewed [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)

### Understand Architecture
- [ ] Understand folder structure
- [ ] Know where API routes are defined
- [ ] Know where models are defined
- [ ] Know where frontend components are
- [ ] Understand frontend-backend communication

## Phase 9: Git & Version Control (5 min)

### Repository Setup
- [ ] Initialized Git: `git init` (if new project)
- [ ] Added remote: `git remote add origin YOUR_REPO_URL`
- [ ] Created `.gitignore` with `.env*` entries
- [ ] Verified node_modules in gitignore
- [ ] Made first commit: `git add . && git commit -m "Initial commit"`

### GitHub Connection
- [ ] Verified code pushed to GitHub
- [ ] Repository is public (for OAuth)
- [ ] Settings configured for deployment

## Phase 10: Deployment Preparation (Optional)

### Frontend (Vercel)
- [ ] Vercel account created
- [ ] Project imported to Vercel
- [ ] Environment variables added
- [ ] Deployment successful
- [ ] Live at custom domain (optional)

### Backend (Railway or alternative)
- [ ] Railway account created
- [ ] Project connected to GitHub
- [ ] Environment variables configured
- [ ] Deployment successful
- [ ] Backend live on production URL

### Domain Configuration
- [ ] Custom domain purchased (optional)
- [ ] DNS records configured
- [ ] SSL certificate verified
- [ ] All services using https

## Troubleshooting Checklist

### Common Issues

**Port Already in Use**
- [ ] Kill process on port 3000: `lsof -i :3000` → `kill -9 PID`
- [ ] Kill process on port 5000: `lsof -i :5000` → `kill -9 PID`

**MongoDB Connection Failed**
- [ ] Verified connection string copied correctly
- [ ] Checked IP whitelist in MongoDB Atlas
- [ ] Verified database user exists
- [ ] Tested connection with mongo shell

**Redis Connection Failed**
- [ ] Verified Redis is running
- [ ] Checked Redis URL is correct
- [ ] Tested with `redis-cli ping`
- [ ] Checked credentials if using remote Redis

**Ollama Not Responding**
- [ ] Verified Ollama service running: `ollama serve`
- [ ] Checked Ollama API: `curl http://localhost:11434`
- [ ] Verified Llama2 model: `ollama list`
- [ ] Restarted Ollama if needed

**GitHub OAuth Failing**
- [ ] Verified Client ID in .env.local
- [ ] Verified Client Secret in backend .env
- [ ] Checked redirect URL matches GitHub settings
- [ ] Cleared browser cookies
- [ ] Tested with new incognito window

**Analysis Job Not Processing**
- [ ] Verified Redis is running
- [ ] Checked MongoDB connection
- [ ] Verified Ollama is accessible
- [ ] Checked backend logs for errors
- [ ] Restarted backend service

## Success Criteria

You're ready to use CodeAnalyzer when:

✅ Frontend loads at http://localhost:3000  
✅ Backend API responds at http://localhost:5000/api  
✅ Can login with GitHub  
✅ Can add repositories  
✅ Can start analysis  
✅ Can see results and metrics  
✅ Can view security issues  
✅ WebSocket updates working (optional)  
✅ All services can restart cleanly  
✅ No console errors or warnings (acceptable)  

## Post-Setup Actions

### Development
- [ ] Create feature branch for customizations
- [ ] Review code structure
- [ ] Understand the architecture
- [ ] Plan customizations/features
- [ ] Set up code editor extensions

### Customization Ideas
- [ ] Change theme colors
- [ ] Add new metrics
- [ ] Modify analysis rules
- [ ] Add new pages
- [ ] Extend API endpoints

### Maintenance
- [ ] Set up log monitoring
- [ ] Plan database backups
- [ ] Monitor resource usage
- [ ] Track feature requests
- [ ] Test regularly

## Final Verification

Before considering setup complete:

1. **Full Flow Test**
   - [ ] Sign in
   - [ ] Add repository
   - [ ] Run analysis
   - [ ] View results
   - [ ] Check security
   - [ ] Sign out

2. **Data Persistence**
   - [ ] Restart backend
   - [ ] Data still there
   - [ ] Can run new analysis
   - [ ] No data loss

3. **Error Recovery**
   - [ ] Kill analysis job
   - [ ] App still responsive
   - [ ] Can retry analysis
   - [ ] No app crashes

4. **Performance**
   - [ ] First load < 3 seconds
   - [ ] Analysis starts < 1 second
   - [ ] Results display smoothly
   - [ ] No memory leaks (check Task Manager)

## Support & Next Steps

- ✅ Setup complete - run locally
- → Deploy to production (see DEPLOYMENT.md)
- → Add team features (future)
- → Integrate with CI/CD (future)
- → Build integrations (future)

---

**Estimated Total Time**: 90-120 minutes

**Difficulty Level**: Intermediate (requires understanding of:)
- JavaScript/TypeScript basics
- Command line
- MongoDB/databases
- Environment variables
- GitHub

**Questions?** Check [README.md](./README.md) or [INFRASTRUCTURE_SETUP.md](./INFRASTRUCTURE_SETUP.md)

---

## Checklist Legend

- ✅ Complete
- ⏳ In Progress
- ⛔ Blocked
- ⏭️ Skip for now
- ❓ Need help

**When complete, you're ready to start using CodeAnalyzer!** 🎉
