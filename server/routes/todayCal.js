import express from 'express';
import User from '../models/User.js';
import { db } from '../db/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const userId = req.user.id;

    await db(); 
    const todayDate = new Date().toISOString().split('T')[0]; // "2025-04-28"

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.json({
                status: 404,
                message: "User not found"
            })
        }

        const todayLog = user.calorieLogs.find(log => log.date === todayDate);

        if (!todayLog) {
            return res.json({
                totalCalories: 0,
                foods: [],
                date: todayDate
            })
        }

        res.json({
            status: 200,
            todayLog,
            calorieGoal: user.calorieGoal,
        })

    } catch (error) {
        res.json({
            status: 500,
            message: "Server error",
            error: error.message
        })
    }
})

export default router;