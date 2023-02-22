import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from 'cors';
import { answer, createQuestion, createSurvey, deleteQuestion, editQuestion, editSurvey, getAllSurveys, getOneSurvey, getQList } from "./controllers/SurveyController.js";
import { login, logout, refresh, register } from "./controllers/TokioUserController.js";
//import { authMiddleware } from './middlewares/authMiddleware.js';
//import { roleMiddleWare } from './middlewares/roleMiddleWare.js';

const PORT = 4444;

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err)
    );

const app = express()

app.use(express.json()); 
app.use(cookieParser());

app.use(cors({
    credentials: true,
    origin: true, 
    allowedHeaders:  ['Content-Type', 'Authorization'],
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD'],
    preflightContinue: true,
}));


// getQList();

// getSurveysList();
app.get('/surveys', getAllSurveys);
// get one Survey
app.get('/surveys/questions/:id', getQList);

// get questions list
app.get('/survey/:id', getOneSurvey);

// create survey
app.post('/createsurvey', /* authMiddleware, roleMiddleWare('ADMIN'),  */createSurvey);
// edit survey
app.put('/survey/:id', /* authMiddleware, roleMiddleWare('ADMIN'),  */editSurvey);


// create question
app.post('/question/create', /* authMiddleware, roleMiddleWare('ADMIN'), */ createQuestion);
// edit question
app.put('/question/edit/:id', /* authMiddleware, roleMiddleWare('ADMIN'), */ editQuestion);
// delete question
app.delete('/question/:id', /* authMiddleware, roleMiddleWare('ADMIN'), */ deleteQuestion);

// post answer
app.post('/answer', answer)


// auth
app.post('/login', login)
app.post('/register', register)
app.post('/logout', logout)
app.get('/refresh', refresh)


app.listen(process.env.PORT || PORT, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log(`server OK`);
});