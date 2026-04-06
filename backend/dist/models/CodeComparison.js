import mongoose, { Schema } from 'mongoose';
const CodeComparisonSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    repo1Id: { type: Schema.Types.ObjectId, ref: 'Repository', required: true },
    repo2Id: { type: Schema.Types.ObjectId, ref: 'Repository', required: true },
    similarities: { type: Number, default: 0 },
    differences: {
        complexity: { type: Number, default: 0 },
        testCoverage: { type: Number, default: 0 },
        documentation: { type: Number, default: 0 },
    },
}, { timestamps: { createdAt: 'createdAt', updatedAt: false } });
export const CodeComparison = mongoose.model('CodeComparison', CodeComparisonSchema);
//# sourceMappingURL=CodeComparison.js.map