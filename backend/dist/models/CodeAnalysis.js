import mongoose, { Schema } from 'mongoose';
const CodeAnalysisSchema = new Schema({
    repositoryId: { type: Schema.Types.ObjectId, ref: 'Repository', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    analysis: {
        overallScore: { type: Number, default: 0 },
        complexity: {
            average: { type: Number, default: 0 },
            high: { type: Number, default: 0 },
            critical: { type: Number, default: 0 },
        },
        maintainability: { type: Number, default: 0 },
        testCoverage: { type: Number, default: 0 },
        documentation: {
            score: { type: Number, default: 0 },
            missingDocs: { type: Number, default: 0 },
        },
    },
    insights: [{ type: String }],
    recommendations: [{ type: String }],
    analyzedAt: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['pending', 'analyzing', 'completed', 'failed'],
        default: 'pending'
    },
}, { timestamps: true });
export const CodeAnalysis = mongoose.model('CodeAnalysis', CodeAnalysisSchema);
//# sourceMappingURL=CodeAnalysis.js.map