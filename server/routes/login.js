import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bcrypt from 'bcrypt';
import { db } from '../db/db.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/', async (req, res) => {
    await db();
    
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                status: 400,
                message: 'User not found'
            });
        }
    
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({
                status: 500,
                message: 'Error comparing passwords',
                error: err.message
                });
            }
        
            if (!result) {
                return res.status(401).json({
                status: 401,
                message: 'Invalid password'
                });
            }
    
            const token = jwt.sign({ 
                id: user._id,
                name: user.name,
                email: user.email,
                currentWeight: user.currentWeight,
                targetWeight: user.targetWeight,
                calorieGoal: user.calorieGoal
            }, process.env.JWT_SECRET);
        
            res.json({
                status: 200,
                message: 'Login successful',
                token,
                user
            });
        });
    } catch (error) {
        res.status(500).json({
        status: 500,
        message: 'Internal server error',
        error: error.message
        });
    }
    });

export default router;