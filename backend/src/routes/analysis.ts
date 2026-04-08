import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Repository } from '../models/Repository.js';
import { CodeAnalysis } from '../models/CodeAnalysis.js';
import { addAnalysisJob, addSecurityScanJob, getJobStatus, analysisQueue, securityQueue } from '../services/queue.js';
const router = Router();
// Middleware to verify JWT
const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        ;
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
// Start analysis for a repository
router.post('/repositories/:id/analyze', verifyToken, async (req, res) => {
    try {
        const user = req.user;
        const repository = await Repository.findOne({
            _id: req.params.id,
            userId: user._id,
        });
        if (!repository) {
            return res.status(404).json({ error: 'Repository not found' });
        }
        // Create analysis record
        let analysis = await CodeAnalysis.findOne({
            repositoryId: repository._id,
        });
        if (!analysis) {
            analysis = new CodeAnalysis({
                repositoryId: repository._id,
                userId: user._id,
                status: 'pending',
            });
        }
        analysis.status = 'pending';
        await analysis.save();
        // Add job to queue
        const job = await addAnalysisJob({
            userId: user._id.toString(),
            repositoryId: repository._id.toString(),
            owner: repository.owner,
            repo: repository.name,
        });
        res.json({
            success: true,
            analysis: {
                id: analysis._id,
                status: 'pending',
                jobId: job.id,
            },
        });
    }
    catch (error) {
        console.error('Error starting analysis:', error);
        res.status(500).json({ error: 'Failed to start analysis' });
    }
});
// Get analysis for a repository
router.get('/repositories/:id/analysis', verifyToken, async (req, res) => {
    try {
        const user = req.user;
        const repository = await Repository.findOne({
            _id: req.params.id,
            userId: user._id,
        });
        if (!repository) {
            return res.status(404).json({ error: 'Repository not found' });
        }
        const analysis = await CodeAnalysis.findOne({
            repositoryId: repository._id,
        });
        res.json({
            success: true,
            analysis: analysis || null,
        });
    }
    catch (error) {
        console.error('Error fetching analysis:', error);
        res.status(500).json({ error: 'Failed to fetch analysis' });
    }
});
// Get job status
router.get('/jobs/:id/status', verifyToken, async (req, res) => {
    try {
        const jobId = req.params.id;
        // Try to get from analysis queue first
        let jobStatus = await getJobStatus(analysisQueue, jobId);
        // If not found, try security queue
        if (!jobStatus) {
            jobStatus = await getJobStatus(securityQueue, jobId);
        }
        if (!jobStatus) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.json({
            success: true,
            job: jobStatus,
        });
    }
    catch (error) {
        console.error('Error fetching job status:', error);
        res.status(500).json({ error: 'Failed to fetch job status' });
    }
});
// Start security scan
router.post('/repositories/:id/security-scan', verifyToken, async (req, res) => {
    try {
        const user = req.user;
        const repository = await Repository.findOne({
            _id: req.params.id,
            userId: user._id,
        });
        if (!repository) {
            return res.status(404).json({ error: 'Repository not found' });
        }
        // Add job to queue
        const job = await addSecurityScanJob({
            userId: user._id.toString(),
            repositoryId: repository._id.toString(),
            owner: repository.owner,
            repo: repository.name,
        });
        res.json({
            success: true,
            scan: {
                jobId: job.id,
                status: 'pending',
            },
        });
    }
    catch (error) {
        console.error('Error starting security scan:', error);
        res.status(500).json({ error: 'Failed to start security scan' });
    }
});
export default router;
//# sourceMappingURL=analysis.js.map