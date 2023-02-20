import mongoose, { Schema } from "mongoose";

const TokioTokenSchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    refreshToken: { type: String, required: true },
},
    { timestamps: true, }
);

export default mongoose.model('TokioToken', TokioTokenSchema);