import mongoose, { Document } from 'mongoose';
export interface IRepository extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    fullName: string;
    owner: string;
    url: string;
    description?: string;
    language?: string;
    stars: number;
    forks: number;
    addedAt: Date;
    lastAnalyzed?: Date;
}
export declare const Repository: mongoose.Model<IRepository, {}, {}, {}, mongoose.Document<unknown, {}, IRepository, {}, {}> & IRepository & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Repository.d.ts.map