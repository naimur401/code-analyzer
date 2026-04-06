import mongoose, { Document } from 'mongoose';
export interface IPerformanceMetric extends Document {
    repositoryId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    metric: string;
    value: number;
    unit: string;
    benchmark?: number;
    status: 'good' | 'warning' | 'critical';
    timestamp: Date;
}
export declare const PerformanceMetric: mongoose.Model<IPerformanceMetric, {}, {}, {}, mongoose.Document<unknown, {}, IPerformanceMetric, {}, {}> & IPerformanceMetric & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=PerformanceMetric.d.ts.map