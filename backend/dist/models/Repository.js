import mongoose, { Schema } from 'mongoose';
const RepositorySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    fullName: { type: String, required: true, index: true },
    owner: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String },
    language: { type: String },
    stars: { type: Number, default: 0 },
    forks: { type: Number, default: 0 },
    lastAnalyzed: { type: Date },
}, { timestamps: { createdAt: 'addedAt', updatedAt: false } });
export const Repository = mongoose.model('Repository', RepositorySchema);
//# sourceMappingURL=Repository.js.map