import TokioTokenModel from "../models/TokioTokenModel.js";
import jwt from "jsonwebtoken";

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, 'jwt-secret-key', { expiresIn: '15m' })
        const refreshToken = jwt.sign(payload, 'jwt-refresh-secret-key', { expiresIn: '180d' })
        return { accessToken, refreshToken }
    }

    /* validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, 'jwt-secret-key')
            return userData;
        } catch (error) {
            return null;
        }
    } */

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, 'jwt-refresh-secret-key').tokensPayload;
            return userData;
        } catch (error) {
            return null;
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await TokioTokenModel.findOne({ user: userId })
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save()
        }
        const token = await TokioTokenModel.create({ user: userId, refreshToken })
        return token;
    }

    async removeToken(refreshToken) {
        const tokenData = await TokioTokenModel.deleteOne({ refreshToken })
        return tokenData;
    }

    async findToken(refreshToken) {
        const tokenData = await TokioTokenModel.findOne({ refreshToken })
        return tokenData;
    }
}

export default new TokenService();