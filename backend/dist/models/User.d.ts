import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    githubId: string;
    username: string;
    email: string;
    avatar: string;
    accessToken: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=User.d.ts.map