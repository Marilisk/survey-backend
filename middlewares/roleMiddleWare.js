import jwt from 'jsonwebtoken';
import TokioUserModel from '../models/TokioUserModel.js';

export const roleMiddleWare = (targetRole) => {

    return async (req, res, next) => {
        if (req.method === 'OPTIONS') {
            next()
        }
    
        try {
            const {refreshToken} = req.cookies;
            if (!refreshToken) {
                return res.status(403).json({ message: 'no token' });
            }
            const userId = jwt.verify(refreshToken, 'jwt-refresh-secret-key').id;
            const {role} = await TokioUserModel.findById(userId);

            let hasRole = false;
            if (role === targetRole) {
                hasRole = true;
            }
            
            if (!hasRole) {
                return res.status(403).json({message: 'You have no access'})
            }
            next();
        } catch (error) {
            console.log(error);
            return res.status(403).json({ message: 'User s not authorised' })
        }
    }
    
}