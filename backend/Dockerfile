FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy TypeScript config and source
COPY tsconfig.json .
COPY src ./src

# Build the application
RUN npm run build

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "dist/index.js"]
