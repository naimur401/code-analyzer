import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { Repository } from '../models/Repository.js';
import { User } from '../models/User.js';
import { GitHubClient } from '../services/github-client.js';
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
// Get user's GitHub repositories
router.get('/repositories/github', verifyToken, async (req, res) => {
    try {
        const user = req.user;
        const ghClient = new GitHubClient(user.accessToken);
        // Get repos from GitHub
        const ghRepos = await ghClient.getUserRepositories();
        res.json({
            success: true,
            repositories: ghRepos.map((repo) => ({
                name: repo.name,
                fullName: repo.full_name,
                owner: repo.owner.login,
                url: repo.html_url,
                description: repo.description,
                language: repo.language,
                stars: repo.stargazers_count,
                forks: repo.forks_count,
            })),
        });
    }
    catch (error) {
        console.error('Error fetching GitHub repos:', error);
        res.status(500).json({ error: 'Failed to fetch repositories' });
    }
});
// Add repository to database
router.post('/repositories', verifyToken, async (req, res) => {
    try {
        const user = req.user;
        const { name, fullName, owner, url, description, language, stars, forks } = req.body;
        // Check if repository already exists
        let repo = await Repository.findOne({
            userId: user._id,
            fullName,
        });
        if (!repo) {
            repo = new Repository({
                userId: user._id,
                name,
                fullName,
                owner,
                url,
                description,
                language,
                stars,
                forks,
            });
            await repo.save();
        }
        res.json({
            success: true,
            repository: repo,
        });
    }
    catch (error) {
        console.error('Error adding repository:', error);
        res.status(500).json({ error: 'Failed to add repository' });
    }
});
// Get user's saved repositories
router.get('/repositories', verifyToken, async (req, res) => {
    try {
        const user = req.user;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const repositories = await Repository.find({ userId: user._id })
            .sort({ addedAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        const total = await Repository.countDocuments({ userId: user._id });
        res.json({
            success: true,
            data: repositories,
            total,
            page,
            pageSize,
            hasMore: page * pageSize < total,
        });
    }
    catch (error) {
        console.error('Error fetching repositories:', error);
        res.status(500).json({ error: 'Failed to fetch repositories' });
    }
});
// Get single repository
router.get('/repositories/:id', verifyToken, async (req, res) => {
    try {
        const user = req.user;
        const repository = await Repository.findOne({
            _id: req.params.id,
            userId: user._id,
        });
        if (!repository) {
            return res.status(404).json({ error: 'Repository not found' });
        }
        res.json({
            success: true,
            repository,
        });
    }
    catch (error) {
        console.error('Error fetching repository:', error);
        res.status(500).json({ error: 'Failed to fetch repository' });
    }
});
// Delete repository
router.delete('/repositories/:id', verifyToken, async (req, res) => {
    try {
        const user = req.user;
        const repository = await Repository.findOneAndDelete({
            _id: req.params.id,
            userId: user._id,
        });
        if (!repository) {
            return res.status(404).json({ error: 'Repository not found' });
        }
        res.json({
            success: true,
            message: 'Repository deleted',
        });
    }
    catch (error) {
        console.error('Error deleting repository:', error);
        res.status(500).json({ error: 'Failed to delete repository' });
    }
});
export default router;
//# sourceMappingURL=repositories.js.map