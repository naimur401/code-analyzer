import mongoose, { Document } from 'mongoose';
export interface ICodeAnalysis extends Document {
    repositoryId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    analysis: {
        overallScore: number;
        complexity: {
            average: number;
            high: number;
            critical: number;
        };
        maintainability: number;
        testCoverage: number;
        documentation: {
            score: number;
            missingDocs: number;
        };
    };
    insights: string[];
    recommendations: string[];
    analyzedAt: Date;
    status: 'pending' | 'analyzing' | 'completed' | 'failed';
}
export declare const CodeAnalysis: mongoose.Model<ICodeAnalysis, {}, {}, {}, mongoose.Document<unknown, {}, ICodeAnalysis, {}, {}> & ICodeAnalysis & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=CodeAnalysis.d.ts.map