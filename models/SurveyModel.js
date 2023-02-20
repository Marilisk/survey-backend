import mongoose from "mongoose";

const SurveySchema = new mongoose.Schema({
    title: {type: String, required: true,},
    questions: Array,
    start: {type: String,}
}, 
{
    timestamps: true, 
});

export default mongoose.model('Survey', SurveySchema);