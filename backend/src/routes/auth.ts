import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { GitHubClient, exchangeCodeForToken } from '../services/github-client.js';
const router = Router();
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '7d',
    });
};
// OAuth callback route
router.post('/auth/github-callback', async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ error: 'Missing authorization code' });
        }
        // Exchange code for access token
        const accessToken = await exchangeCodeForToken(code);
        // Get user info from GitHub
        const ghClient = new GitHubClient(accessToken);
        const ghUser = await ghClient.getUser();
        // Find or create user in MongoDB
        let user = await User.findOne({ githubId: ghUser.id });
        if (!user) {
            user = new User({
                githubId: ghUser.id,
                username: ghUser.login,
                email: ghUser.email || `${ghUser.login}@github.local`,
                avatar: ghUser.avatar_url,
                accessToken,
            });
            await user.save();
        }
        else {
            // Update access token if it changed
            user.accessToken = accessToken;
            await user.save();
        }
        // Generate JWT token
        const token = generateToken(user._id.toString());
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
            },
        });
    }
    catch (error) {
        console.error('Auth error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
});
// Get current user
router.get('/auth/me', async (req, res) => {
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
        res.json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
            },
        });
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
});
// Logout (token invalidation handled client-side)
router.post('/auth/logout', (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
});
export default router;
//# sourceMappingURL=auth.js.map