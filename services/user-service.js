import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import mailService from "./mail-service.js";
import tokenService from "./token-service.js";
import TokioUserModel from '../models/TokioUserModel.js';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET

class UserService {

    async register(email, fullName, password) {
        
        const salt = await bcrypt.genSalt(3)
        const hashPassword = await bcrypt.hash(password, salt)
        const activationLink = uuidv4();
        const user = await TokioUserModel.create({ email, 
                                             fullName, 
                                             password: hashPassword, 
                                             activationLink, 
                                             role: 'USER', })
        //await mailService.sendActivationMail(email, `http://localhost:4444/activate/${activationLink}`);
        const tokensPayload = {email: user.email, id: user.id, isActivated: user.isActivated};
        const accessToken = jwt.sign(tokensPayload, JWT_ACCESS_SECRET, {expiresIn: '15m'})
        const refreshToken = jwt.sign(tokensPayload, JWT_REFRESH_SECRET, {expiresIn: '180d'});
        const tokens = {accessToken, refreshToken};
        await tokenService.saveToken(tokensPayload.id, tokens.refreshToken);
        return { ...tokens, user }
    }

    async activate(activationLink) {
        const user = await TokioUserModel.findOne({activationLink})
        if(!user) {
            return res.status(404).json({
                message: 'Incorrect authorisation link',
            });
        }
        user.isActivated = true;
        await user.save()
    }

    async login(user) {
        
        const tokensPayload = {email: user.email, id: user.id, isActivated: user.isActivated};
        const accessToken = jwt.sign(tokensPayload, JWT_ACCESS_SECRET, {expiresIn: '15m'})
        const refreshToken = jwt.sign(tokensPayload, JWT_REFRESH_SECRET, {expiresIn: '180d'});
        const tokens = {accessToken, refreshToken};

        await tokenService.saveToken(user.id, refreshToken);
        return { ...tokens, user }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

}


export default new UserService();