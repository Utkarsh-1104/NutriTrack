import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.json({
            status: 401,
            message: 'Unauthorized'
        })
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded) {
            req.user = decoded;
            next();
        } else {
            return res.json({
                status: 401,
                message: 'Unauthorized'
            })
        }
    } catch (error) {
        return res.json({
            status: 401,
            message: 'Unauthorized',
            error: error.message
        })   
    }
}

export default authMiddleware;