import jwt from 'jsonwebtoken';
import TokioUserModel from '../models/TokioUserModel.js';
import userService from '../services/user-service.js';
import tokenService from '../services/token-service.js';
import bcrypt from 'bcrypt';

export const register = async (req, res, next) => {
    try {
        const { email, fullName, password } = req.body;
        const candidate = await TokioUserModel.findOne({email})
        if (candidate) {
            return res.status(400).json({message: `Email ${email} is already taken`});
        }
        const userData = await userService.register(email, fullName, password);
    

        res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true })
        res.json(userData);
    } catch (error) {
        console.log('register error', error);
        res.status(500).json({
            message: 'Cannot register'
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await TokioUserModel.findOne({email})
        if (!user) {
            return res.status(400).json({message: `account with email ${email} doesnt exist`});
        }
        const isPassValid = await bcrypt.compare(password, user.password);
        if (!isPassValid) {
            return res.status(400).json({message: 'неверный логин или пароль'})
        }
        
        const userData = await userService.login(user);
        
        res.cookie('refreshToken', userData.refreshToken, 
            { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true })
        res.json(userData);
    } catch (error) {
        console.log('login error', error);
        res.status(500).json({
            message: 'Cannot login'
        })
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await TokioTokioUserModel.find();
        res.json(users)
    } catch (error) {
        console.log(error)
    }
}


export const logout = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        const token = await userService.logout(refreshToken);
        res.clearCookie('refreshToken');
        return res.json(token)
    } catch (error) {
        console.log('logout error', error);
        res.status(500).json({
            message: 'Cannot logout'
        })
    }
}


export const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        const userData = jwt.verify(refreshToken, 'jwt-refresh-secret-key');
        const tokenFromDB = await tokenService.findToken(refreshToken);
        if (!refreshToken || !userData || !tokenFromDB) {
            return res.status(401).json({ message: `no token or smthing` });
        }
        const user = await TokioUserModel.findById(userData.id);
        const userPayload = { email: user.email, id: user.id, isActivated: user.isActivated };
        const tokens = tokenService.generateTokens({ ...userPayload });
        await tokenService.saveToken(userPayload.id, tokens.refreshToken);
        res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true })
        return res.json({ user, tokens });

    } catch (error) {
        console.log('refresh error', error)
        return res.status(500).json({
            message: 'Cannot refresh'
        })
    }
}



