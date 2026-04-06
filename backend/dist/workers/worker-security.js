import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { securityQueue } from '../services/queue.js';
import { SecurityVulnerability } from '../models/SecurityVulnerability.js';
import { Repository } from '../models/Repository.js';
import { GitHubClient } from '../services/github-client.js';
import { scanSecurityWithLLM } from '../services/llm-analyzer.js';
dotenv.config();
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || '').then(() => {
    console.log('Security Worker connected to MongoDB');
});
// Process security scan jobs
securityQueue.process(async (job) => {
    try {
        console.log(`Processing security scan job ${job.id}`);
        const { userId, repositoryId, owner, repo } = job.data;
        // Update job progress
        await job.progress(10);
        // Get repository
        const repository = await Repository.findById(repositoryId);
        if (!repository) {
            throw new Error('Repository not found');
        }
        // Get user and GitHub client
        const user = await mongoose.model('User').findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const ghClient = new GitHubClient(user.accessToken);
        await job.progress(20);
        // Get repository files to scan
        const contents = await ghClient.getRepositoryContent(owner, repo);
        const filesToScan = extractFilesToScan(contents);
        await job.progress(40);
        // Run LLM-based security scan
        const scanResults = await scanSecurityWithLLM({
            repositoryName: repo,
            owner: owner,
            files: filesToScan.slice(0, 10), // Limit files to scan
        });
        await job.progress(70);
        // Clear existing vulnerabilities for this repository
        await SecurityVulnerability.deleteMany({ repositoryId });
        // Save vulnerabilities
        for (const vuln of scanResults.vulnerabilities) {
            const vulnerability = new SecurityVulnerability({
                repositoryId,
                userId,
                severity: vuln.severity || 'low',
                type: vuln.type,
                description: vuln.description,
                file: vuln.file || 'unknown',
                line: vuln.line || 0,
                recommendation: vuln.recommendation,
            });
            await vulnerability.save();
        }
        await job.progress(100);
        return {
            success: true,
            vulnerabilitiesFound: scanResults.vulnerabilities.length,
            critical: scanResults.vulnerabilities.filter((v) => v.severity === 'critical').length,
        };
    }
    catch (error) {
        console.error('Security worker error:', error);
        throw error;
    }
});
function extractFilesToScan(contents) {
    const files = [];
    const scan = (items, path = '') => {
        if (!Array.isArray(items))
            return;
        for (const item of items) {
            if (item.type === 'file') {
                const filename = `${path}${item.name}`;
                // Focus on code and config files
                if (/\.(js|ts|jsx|tsx|py|java|go|rs|rb|php|cs|cpp|c|h|json|yaml|yml|xml|toml|env)$/.test(filename)) {
                    files.push(filename);
                }
            }
            else if (item.type === 'dir' && path.split('/').length < 3) {
                scan(item.contents, `${path}${item.name}/`);
            }
        }
    };
    scan(contents);
    return files.slice(0, 20); // Limit to 20 files
}
console.log('Security scan worker started');
//# sourceMappingURL=worker-security.js.map