import AnswerFormModel from '../models/AnswerFormModel.js';
import QuestionModel from '../models/QuestionModel.js';
import SurveyModel from '../models/SurveyModel.js';


export const createSurvey = async (req, res) => {
    try {
        const newSurvey = new SurveyModel({
            title: req.body.title,
            questions: [],
            startQuestion: req.body.startQuestion,
        });
        const survey = await newSurvey.save();
        res.json(survey);
    } catch (error) {
        console.log('createOrder error ', error);
        res.status(500).json({
            message: 'Не удалось создать опрос',
        })
    }
}

export const editSurvey = async (req, res) => {
    try {
        const innovatedSurvey = await SurveyModel.findByIdAndUpdate({ _id: req.params.id },
            {
                title: req.body.title,
                start: req.body.start,
            },
            { returnDocument: 'after', },
        );
        res.json(innovatedSurvey);
    } catch (error) {
        console.log('createOrder error ', error);
        res.status(500).json({
            message: 'Не удалось отредактировать опрос',
        })
    }
}

export const createQuestion = async (req, res) => {
    try {
        const survey = await SurveyModel.findById(req.body.surveyId)
        const newQuestion = new QuestionModel({
            surveyId: req.body.surveyId,
            nextid: req.body.nextid,
            yes: req.body.yes,
            no: req.body.no,
            type: req.body.type,
            question: req.body.question,
            answers: req.body.answers,
            validation: req.body.validation,
        });
        const question = await newQuestion.save();
        survey.questions.push(question._id)
        await survey.save()
        res.json(question._id);
    } catch (error) {
        console.log('createOrder error ', error);
        res.status(500).json({
            message: 'Не удалось создать вопрос',
        })
    }
}

export const editQuestion = async (req, res) => {
    try {
        const innovatedQuestion = await QuestionModel.findByIdAndUpdate({ _id: req.params.id },
            {
                surveyId: req.body.surveyId,
                nextid: req.body.nextid,
                yes: req.body.yes,
                no: req.body.no,
                type: req.body.type,
                question: req.body.question,
                answers: req.body.answers,
                validation: req.body.validation,
            },
            { returnDocument: 'after', },
        );
        res.json(innovatedQuestion);
    } catch (error) {
        console.log('createOrder error ', error);
        res.status(500).json({
            message: 'Не удалось создать вопрос',
        })
    }
}

export const getOneSurvey = async (req, res) => {
    try {
        const Id = req.params.id;
        const survey = await SurveyModel.findOne({ _id: Id }).exec();
        res.json(survey);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'опрос не найден',
        })
    }
}

export const getAllSurveys = async (req, res) => {
    try {
        const surveys = await SurveyModel.find();
        res.json(surveys)
    } catch (error) {
        console.log(error)
    }
}

export const getQList = async (req, res) => {
    try {
        const survey = await SurveyModel.findById(req.params.id).exec();
        const qList = []
        for (let questionId of survey.questions) {
            const question = await QuestionModel.findById(questionId)
            qList.push(question)
        }
        res.json({questions: qList, start: survey.start, title: survey.title})
    } catch (error) {
        console.log(error)
    }
}

export const deleteQuestion = async (req, res) => {
    try {
        const questionId = req.params.id
        const question = await QuestionModel.findById(questionId)
        const survey = await SurveyModel.findById(question.surveyId)
        const renewedQuestions = survey.questions.filter(el => el.toString() !== questionId)
        survey.questions = renewedQuestions;
        survey.save()
        await QuestionModel.findByIdAndRemove(questionId)
        res.json('success')
    } catch (error) {
        console.log(error)
    }
}


export const answer = async (req, res) => {
    try {
        const newForm = new AnswerFormModel({
            surveyId: req.body.survey_id,
            answers: req.body.answers,
        })
        await newForm.save()
        res.json('success')
    } catch (error) {
        console.log(error)
    }
}





