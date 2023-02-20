import mongoose from "mongoose";

const TokioUserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, },
    fullName: { type: String, required: true, },
    password: { type: String, required: true, },
    activationLink: { type: String },
    role: { type: String, default: 'USER', /* ref: 'Role' */ },
    isActivated: { type: Boolean, default: false, },
},
    { timestamps: true, }
);

export default mongoose.model('TokioUser', TokioUserSchema);