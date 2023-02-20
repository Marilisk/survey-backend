import mongoose from "mongoose";

const AnswerFormSchema = new mongoose.Schema({
    surveyId: {type: String, required: true,},
    answers: Object,
}, 
{
    timestamps: true, 
});

export default mongoose.model('AnswerForm', AnswerFormSchema);