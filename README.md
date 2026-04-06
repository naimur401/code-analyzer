# CodeAnalyzer - GitHub Code Analysis Platform

A comprehensive platform for analyzing GitHub repositories with AI-powered code review, security scanning, and performance metrics. Built with Next.js frontend, Express backend, MongoDB database, Redis job queue, and local LLM (Ollama/Llama2).

## Features

- **GitHub OAuth Integration**: Connect your GitHub account and analyze your repositories
- **AI-Powered Code Analysis**: Automated analysis using local LLM with complexity metrics, maintainability scoring, and test coverage estimation
- **Security Scanning**: Identify vulnerabilities, dependency issues, and security best practices violations
- **Performance Metrics**: Track code quality metrics and performance indicators
- **Repository Comparison**: Compare metrics across multiple repositories side-by-side
- **Real-time Updates**: WebSocket integration for live job progress tracking
- **Job Queue System**: Bull/BullMQ for reliable background job processing
- **Beautiful Dashboard**: Professional analytics dashboard with dark theme

## Architecture

### Frontend
- **Framework**: Next.js 16 with App Router
- **UI Components**: shadcn/ui with Tailwind CSS
- **State Management**: Zustand for authentication and UI state
- **HTTP Client**: Custom fetch-based API client
- **Real-time**: WebSocket support for live updates

### Backend
- **Server**: Express.js with TypeScript
- **Database**: MongoDB Atlas for data persistence
- **Job Queue**: Bull/BullMQ with Redis for background jobs
- **AI Engine**: Ollama with Llama2 for local LLM analysis
- **Authentication**: GitHub OAuth with JWT tokens
- **Real-time**: Socket.IO for WebSocket communication

### Infrastructure
- **Database**: MongoDB Atlas (cloud)
- **Cache/Queue**: Redis (Upstash or local)
- **LLM**: Ollama with Llama2 model
- **Deployment**: Vercel (frontend), Docker/Railway (backend)

## Prerequisites

### Required
- Node.js 18+ and npm/pnpm
- Git
- GitHub OAuth App credentials
- MongoDB Atlas account (free tier available)
- Redis instance (Upstash Redis or local)
- Ollama installed with Llama2 model

### Optional
- Docker (for containerized deployment)
- Vercel account (for frontend deployment)
- Railway/Fly.io (for backend deployment)

## Environment Setup

### 1. GitHub OAuth Setup
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL to `http://localhost:3000/auth/callback` (development)
4. Copy Client ID and Client Secret

### 2. MongoDB Atlas Setup
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user with username and password
3. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority`
4. Create a database named `code-analysis`

### 3. Redis Setup
**Option A: Upstash (Recommended)**
1. Go to [Upstash](https://upstash.com)
2. Create a new Redis database
3. Copy the Redis URL

**Option B: Local Redis**
```bash
# macOS
brew install redis
redis-server

# Docker
docker run -d -p 6379:6379 redis:latest
```

### 4. Ollama Setup
1. Download and install [Ollama](https://ollama.ai)
2. Pull the Llama2 model:
```bash
ollama pull llama2
```
3. Run Ollama service: `ollama serve`

## Installation

### Frontend Setup
```bash
# Install dependencies
pnpm install

# Copy environment template
cp .env.local.example .env.local

# Add your GitHub OAuth Client ID
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_client_id
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000/api
```

### Backend Setup
```bash
cd backend

# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env

# Add your credentials
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/code-analysis
REDIS_URL=redis://default:password@host:6379
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=llama2
JWT_SECRET=your_jwt_secret_key
```

## Running Locally

### Terminal 1: Start Ollama
```bash
ollama serve
```

### Terminal 2: Start Redis (if using local)
```bash
redis-server
```

### Terminal 3: Start Frontend
```bash
pnpm dev
# Runs on http://localhost:3000
```

### Terminal 4: Start Backend
```bash
cd backend
pnpm run dev
# Runs on http://localhost:5000
```

### Terminal 5: Start Analysis Worker (optional)
```bash
cd backend
pnpm ts-node src/workers/worker-analysis.ts
```

### Terminal 6: Start Security Worker (optional)
```bash
cd backend
pnpm ts-node src/workers/worker-security.ts
```

## API Endpoints

### Authentication
- `POST /api/auth/github-callback` - Exchange GitHub code for JWT token
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout

### Repositories
- `GET /api/repositories/github` - Fetch user's GitHub repositories
- `GET /api/repositories` - Get saved repositories (paginated)
- `POST /api/repositories` - Add repository to database
- `GET /api/repositories/:id` - Get single repository
- `DELETE /api/repositories/:id` - Delete repository

### Analysis
- `POST /api/repositories/:id/analyze` - Start code analysis
- `GET /api/repositories/:id/analysis` - Get analysis results
- `GET /api/jobs/:id/status` - Get job status
- `POST /api/repositories/:id/security-scan` - Start security scan

## Database Schema

### Users Collection
```typescript
{
  _id: ObjectId,
  githubId: string,
  username: string,
  email: string,
  avatar: string,
  accessToken: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Repositories Collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  name: string,
  fullName: string,
  owner: string,
  url: string,
  description: string,
  language: string,
  stars: number,
  forks: number,
  addedAt: Date,
  lastAnalyzed: Date
}
```

### CodeAnalysis Collection
```typescript
{
  _id: ObjectId,
  repositoryId: ObjectId,
  userId: ObjectId,
  analysis: {
    overallScore: number,
    complexity: { average, high, critical },
    maintainability: number,
    testCoverage: number,
    documentation: { score, missingDocs }
  },
  insights: string[],
  recommendations: string[],
  analyzedAt: Date,
  status: string,
  createdAt: Date,
  updatedAt: Date
}
```

## Deployment

### Frontend (Vercel)
```bash
# Connect your GitHub repository to Vercel
# Add environment variables in Vercel dashboard
# Deploy with `git push`
```

### Backend (Docker)
```bash
cd backend

# Build Docker image
docker build -t codeanalyzer-backend .

# Run container
docker run -p 5000:5000 \
  -e MONGODB_URI=... \
  -e REDIS_URL=... \
  codeanalyzer-backend
```

## Project Structure

```
codeanalyzer/
├── app/                      # Next.js app directory
│   ├── page.tsx             # Landing page
│   ├── dashboard/           # Protected dashboard routes
│   │   ├── repositories/
│   │   ├── analysis/
│   │   ├── security/
│   │   └── settings/
│   └── auth/
│       └── callback/        # GitHub OAuth callback
├── components/              # React components
│   └── GitHubOAuth.tsx
├── lib/
│   ├── api.ts              # API client
│   ├── types.ts            # TypeScript types
│   └── store/
│       └── auth.ts         # Auth Zustand store
├── public/                  # Static assets
├── backend/
│   ├── src/
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   ├── workers/        # Job processors
│   │   └── index.ts        # Express server
│   └── package.json
└── INFRASTRUCTURE_SETUP.md
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Support

For issues and questions:
- Open an issue on GitHub
- Check INFRASTRUCTURE_SETUP.md for setup troubleshooting
- Review API documentation in the code

## Roadmap

- [ ] Webhook support for automatic analysis on push
- [ ] Advanced code metrics (cyclomatic complexity, maintainability index)
- [ ] Custom analysis rules and policies
- [ ] Team collaboration features
- [ ] API rate limiting and quotas
- [ ] Advanced reporting and export options
- [ ] Integration with CI/CD pipelines
- [ ] Multi-language support
- [ ] Code quality trends over time
- [ ] Automated fixes suggestions
