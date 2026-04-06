import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import repositoryRoutes from './routes/repositories.js';
import analysisRoutes from './routes/analysis.js';
dotenv.config();
const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    },
});
// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || '');
        console.log('Connected to MongoDB');
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
// Routes
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});
app.get('/api/status', (req, res) => {
    res.json({
        service: 'CodeAnalyzer Backend',
        version: '1.0.0',
        status: 'running',
        timestamp: new Date(),
    });
});
// API Routes
app.use('/api', authRoutes);
app.use('/api', repositoryRoutes);
app.use('/api', analysisRoutes);
// WebSocket events
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('subscribe_analysis', (analysisId) => {
        socket.join(`analysis_${analysisId}`);
        console.log(`Client subscribed to analysis: ${analysisId}`);
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({
        success: false,
        error: err.message || 'Internal server error',
    });
});
// Setup event broadcasting for jobs
export function broadcastJobProgress(jobId, progress, analysisId) {
    io.emit(`job_${jobId}_progress`, { jobId, progress, analysisId });
    if (analysisId) {
        io.emit(`analysis_${analysisId}_progress`, { jobId, progress });
    }
}
export function broadcastJobCompleted(jobId, result, analysisId) {
    io.emit(`job_${jobId}_completed`, { jobId, result, analysisId });
    if (analysisId) {
        io.emit(`analysis_${analysisId}_completed`, { jobId, result });
    }
}
export function broadcastJobFailed(jobId, error, analysisId) {
    io.emit(`job_${jobId}_failed`, { jobId, error, analysisId });
    if (analysisId) {
        io.emit(`analysis_${analysisId}_failed`, { jobId, error });
    }
}
// Initialize and start server
const startServer = async () => {
    await connectDB();
    const PORT = parseInt(process.env.PORT || '5000', 10);
    httpServer.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`WebSocket server ready`);
    });
};
startServer().catch(console.error);
// Export for testing (functions already exported above)
//# sourceMappingURL=index.js.map