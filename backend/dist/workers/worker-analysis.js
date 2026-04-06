import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { analysisQueue } from '../services/queue.js';
import { CodeAnalysis } from '../models/CodeAnalysis.js';
import { Repository } from '../models/Repository.js';
import { GitHubClient } from '../services/github-client.js';
import { User } from '../models/User.js';
import { analyzeCodeWithLLM } from '../services/llm-analyzer.js';
dotenv.config();
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || '').then(() => {
    console.log('Worker connected to MongoDB');
});
// Process jobs
analysisQueue.process(async (job) => {
    try {
        console.log(`Processing analysis job ${job.id}`);
        const { userId, repositoryId, owner, repo } = job.data;
        // Update job progress
        await job.progress(10);
        // Find analysis record
        const analysis = await CodeAnalysis.findOne({
            repositoryId,
            userId,
        });
        if (!analysis) {
            throw new Error('Analysis record not found');
        }
        analysis.status = 'analyzing';
        await analysis.save();
        // Get repository info
        const repository = await Repository.findById(repositoryId);
        if (!repository) {
            throw new Error('Repository not found');
        }
        // Update GitHub info
        const user = await User.findById(userId);
        if (!user)
            throw new Error('User not found');
        const ghClient = new GitHubClient(user.accessToken);
        const ghRepo = await ghClient.getRepository(owner, repo);
        await job.progress(20);
        // Fetch repository structure and code samples
        const contents = await ghClient.getRepositoryContent(owner, repo);
        const languages = await ghClient.getRepositoryLanguages(owner, repo);
        await job.progress(40);
        // Perform analysis using LLM
        const analysisResult = await analyzeCodeWithLLM({
            repositoryName: repo,
            owner: owner,
            languages: languages,
            structure: contents,
        });
        await job.progress(70);
        // Save analysis results
        analysis.analysis = {
            overallScore: analysisResult.overallScore,
            complexity: analysisResult.complexity,
            maintainability: analysisResult.maintainability,
            testCoverage: analysisResult.testCoverage,
            documentation: analysisResult.documentation,
        };
        analysis.insights = analysisResult.insights;
        analysis.recommendations = analysisResult.recommendations;
        analysis.status = 'completed';
        analysis.analyzedAt = new Date();
        await analysis.save();
        // Update repository last analyzed time
        repository.lastAnalyzed = new Date();
        await repository.save();
        await job.progress(100);
        return {
            success: true,
            analysisId: analysis._id,
            results: analysisResult,
        };
    }
    catch (error) {
        console.error('Worker error:', error);
        throw error;
    }
});
console.log('Analysis worker started');
//# sourceMappingURL=worker-analysis.js.map