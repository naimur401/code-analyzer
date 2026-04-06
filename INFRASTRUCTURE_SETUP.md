# GitHub Code Analysis Platform - Infrastructure Setup

## Prerequisites & Environment Variables

This project requires several external services. Follow the setup instructions below.

### 1. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (M0 tier)
3. Create a database user with username and password
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority`)
5. Create a database named `code-analysis`

**Add to environment variables:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/code-analysis?retryWrites=true&w=majority
```

### 2. Redis Setup

Option A: Upstash Redis (Recommended for serverless)
1. Go to [Upstash](https://upstash.com)
2. Create a new Redis database
3. Copy the connection string

Option B: Local Redis (Development)
```bash
# Install Redis locally
brew install redis  # macOS
# or docker run -d -p 6379:6379 redis:latest

# Start Redis
redis-server
```

**Add to environment variables:**
```
REDIS_URL=redis://default:password@host:6379
```

### 3. Ollama Setup (Local LLM)

1. Download [Ollama](https://ollama.ai)
2. Install and run Ollama
3. Pull Llama 2 model:
```bash
ollama pull llama2
```
4. Ollama runs on http://localhost:11434

**Add to environment variables:**
```
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=llama2
```

### 4. GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL to `http://localhost:3000/api/auth/callback` (development)
4. Copy Client ID and Client Secret

**Add to environment variables:**
```
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
GITHUB_CALLBACK_URL=http://localhost:3000/api/auth/callback
```

### 5. Backend Service Setup

The Express backend will run on a separate port (typically 5000).

**Add to environment variables:**
```
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
```

## Environment Variables Summary

Create a `.env.local` file in the frontend directory with all variables above.

For the backend, create a `.env` file in the backend directory.

## Running Locally

1. **MongoDB**: Use MongoDB Atlas cloud or local MongoDB
2. **Redis**: Start your Redis instance
3. **Ollama**: Run `ollama serve` in a terminal
4. **Backend**: Run `npm run dev` in the backend directory
5. **Frontend**: Run `npm run dev` in the frontend directory

## Next Steps

See the build instructions for frontend and backend setup.
