import mongoose, { Document } from 'mongoose';
export interface ICodeComparison extends Document {
    userId: mongoose.Types.ObjectId;
    repo1Id: mongoose.Types.ObjectId;
    repo2Id: mongoose.Types.ObjectId;
    similarities: number;
    differences: {
        complexity: number;
        testCoverage: number;
        documentation: number;
    };
    createdAt: Date;
}
export declare const CodeComparison: mongoose.Model<ICodeComparison, {}, {}, {}, mongoose.Document<unknown, {}, ICodeComparison, {}, {}> & ICodeComparison & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=CodeComparison.d.ts.map