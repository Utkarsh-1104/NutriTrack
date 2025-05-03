import express from 'express';
import User from '../models/User.js';
import { db } from '../db/db.js';

const router = express.Router()

router.get('/', async (req, res) => {
    const userId = req.user.id

    try {
        await db()

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User not found"
            })
        }

        const profileData = {
            id: user._id,
            name: user.name,
            email: user.email,
            currentWeight: user.currentWeight,
            targetWeight: user.targetWeight,
            calorieGoal: user.calorieGoal,
        }
        res.json({
            status: 200,
            data: profileData
        })
        
    } catch (error) {
        res.json({
            status: 500,
            message: "Server error",
            error: error.message
        })
    }
})

export default router