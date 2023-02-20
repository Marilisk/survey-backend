import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    surveyId: { type: String, required: true, },
    nextid: { type: String, },
    yes: { type: String, },
    no: { type: String, },
    type: { type: String, default: 'radio', },
    question: { type: String, required: true, },
    answers: Array,
    validation: String,
},
    {
        timestamps: true, // прикручием дату создания и обновления сущности
    });

export default mongoose.model('Question', QuestionSchema);