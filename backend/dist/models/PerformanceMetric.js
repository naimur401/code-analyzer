import mongoose, { Schema } from 'mongoose';
const PerformanceMetricSchema = new Schema({
    repositoryId: { type: Schema.Types.ObjectId, ref: 'Repository', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    metric: { type: String, required: true },
    value: { type: Number, required: true },
    unit: { type: String, required: true },
    benchmark: { type: Number },
    status: {
        type: String,
        enum: ['good', 'warning', 'critical'],
        default: 'good',
    },
    timestamp: { type: Date, default: Date.now },
}, { timestamps: true });
export const PerformanceMetric = mongoose.model('PerformanceMetric', PerformanceMetricSchema);
//# sourceMappingURL=PerformanceMetric.js.map