import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { comparisonQueue } from '../services/queue.js';
// import { CodeComparison } from '../models/CodeComparison.js'
import { CodeAnalysis } from '../models/CodeAnalysis.js';
dotenv.config();
// Create CodeComparison model if it doesn't exist
const ComparisonSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    repo1Id: { type: mongoose.Schema.Types.ObjectId, ref: 'Repository', required: true },
    repo2Id: { type: mongoose.Schema.Types.ObjectId, ref: 'Repository', required: true },
    similarities: { type: Number, default: 0 },
    differences: {
        complexity: { type: Number, default: 0 },
        testCoverage: { type: Number, default: 0 },
        documentation: { type: Number, default: 0 },
    },
    createdAt: { type: Date, default: Date.now },
});
const CodeComparison = mongoose.model('CodeComparison', ComparisonSchema);
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || '').then(() => {
    console.log('Comparison Worker connected to MongoDB');
});
// Process comparison jobs
comparisonQueue.process(async (job) => {
    try {
        console.log(`Processing comparison job ${job.id}`);
        const { userId, repo1Id, repo2Id } = job.data;
        await job.progress(20);
        // Get both analyses
        const analysis1 = await CodeAnalysis.findOne({ repositoryId: repo1Id });
        const analysis2 = await CodeAnalysis.findOne({ repositoryId: repo2Id });
        if (!analysis1 || !analysis2) {
            throw new Error('One or both analyses not found');
        }
        await job.progress(50);
        // Calculate comparison metrics
        const score1 = analysis1.analysis.overallScore || 0;
        const score2 = analysis2.analysis.overallScore || 0;
        const complexity1 = analysis1.analysis.complexity.average || 0;
        const complexity2 = analysis2.analysis.complexity.average || 0;
        const coverage1 = analysis1.analysis.testCoverage || 0;
        const coverage2 = analysis2.analysis.testCoverage || 0;
        const docs1 = analysis1.analysis.documentation.score || 0;
        const docs2 = analysis2.analysis.documentation.score || 0;
        // Calculate similarities (0-100)
        const similarities = calculateSimilarity([score1, score2], [complexity1, complexity2], [coverage1, coverage2], [docs1, docs2]);
        // Calculate differences
        const differences = {
            complexity: Math.abs(complexity1 - complexity2),
            testCoverage: Math.abs(coverage1 - coverage2),
            documentation: Math.abs(docs1 - docs2),
        };
        await job.progress(80);
        // Save comparison
        const comparison = new CodeComparison({
            userId,
            repo1Id,
            repo2Id,
            similarities,
            differences,
        });
        await comparison.save();
        await job.progress(100);
        return {
            success: true,
            comparisonId: comparison._id,
            similarities,
            differences,
        };
    }
    catch (error) {
        console.error('Comparison worker error:', error);
        throw error;
    }
});
function calculateSimilarity(scores, complexities, coverages, docs) {
    // Compare overall scores
    const scoreDiff = Math.abs(scores[0] - scores[1]);
    const complexityDiff = Math.abs(complexities[0] - complexities[1]);
    const coverageDiff = Math.abs(coverages[0] - coverages[1]);
    const docsDiff = Math.abs(docs[0] - docs[1]);
    // Average differences (0-100), invert to get similarity
    const avgDiff = (scoreDiff + complexityDiff + coverageDiff + docsDiff) / 4;
    return Math.max(0, 100 - avgDiff);
}
console.log('Comparison worker started');
//# sourceMappingURL=worker-comparison.js.map