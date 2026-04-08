import mongoose, { Schema } from 'mongoose';
const UserSchema = new Schema({
    githubId: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String },
    accessToken: { type: String, required: true },
}, { timestamps: true });
export const User = mongoose.model('User', UserSchema);
//# sourceMappingURL=User.js.map