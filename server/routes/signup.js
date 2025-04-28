import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcrypt';
import { db } from '../db/db.js';
import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/', async (req, res) => {
  await db();

  const { name, email, password, currentWeight, targetWeight } = req.body;

  let multiplier = 30; // maintain
  if (currentWeight > targetWeight) {
    multiplier = 25;
  } else {
    multiplier = 35;
  }
  
  const calorieGoal = multiplier * currentWeight;
  
  try {
    const existingUser = await User.find({ email });
    if (existingUser > 0) {
      return res.status(400).json({
        status: 400,
        message: 'User already exists',
      });
    }

    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        return res.status(500).json({
          status: 500,
          message: 'Error hashing password',
          error: err.message
        });
      }

      const newUser = new User({
        name,
        email,
        password: hash,
        currentWeight,
        targetWeight,
        calorieGoal
      });

      await newUser.save();
    })

    const token = jwt.sign({ 
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      currentWeight: newUser.currentWeight,
      targetWeight: newUser.targetWeight,
      calorieGoal: newUser.calorieGoal
    }, process.env.JWT_SECRET);

    res.json({
      status: 201,
      message: 'User created successfully',
      user: newUser,
      token
    });

  } catch(error) {
    res.json({
      status: 500,
      message: 'Error creating user',
      error: error.message
    })
  }
});

export default router;