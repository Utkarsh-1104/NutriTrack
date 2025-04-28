import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { foodName, calories } = req.body;
    const userId = req.user.id;
  
    const todayDate = new Date().toISOString().split('T')[0]; // "2025-04-28"
  
    try {
      const user = await User.findById(userId);
  
      if (!user) return res.status(404).json({ message: "User not found" });
  
      let todayLog = user.calorieLogs.find(log => log.date === todayDate);
  
      if (!todayLog) {
        // no log for today yet — create one
        todayLog = { date: todayDate, totalCalories: 0, foods: [] };
        user.calorieLogs.push(todayLog);
      }
  
      // add food item
      todayLog.foods.push({ foodName, calories });
      todayLog.totalCalories += calories;
      console.log(todayLog)
  
      await user.save();
  
      res.status(200).json({ message: "Food added successfully", todayLog });
  
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
});

export default router;