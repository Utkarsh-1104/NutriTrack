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
  //const { name, email, password, currentWeight, targetWeight } = req.body;
  console.log(req.body);

  let multiplier = 30; // maintain
  if (req.body.currentWeight > req.body.targetWeight) {
    multiplier = 25;
  } else {
    multiplier = 35;
  }
  
  const calorieGoal = multiplier * req.body.currentWeight;
  
  try {
    const existingUser = await User.findOne({
      email: req.body.email
    });

    if (existingUser) {
      return res.json({
        status: 409,
        message: 'User already exists'
      });
    }

    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      const newUser = await new User({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        currentWeight: req.body.currentWeight,
        targetWeight: req.body.targetWeight,
        calorieGoal: calorieGoal,
      });

      await newUser.save();

      const token = jwt.sign({ 
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        currentWeight: newUser.currentWeight,
        targetWeight: newUser.targetWeight,
        calorieGoal: newUser.calorieGoal
      }, process.env.JWT_SECRET);
  
      res.json({
        status: 200,
        message: 'User created successfully',
        user: newUser,
        token
      });
    })


  } catch(error) {
    res.json({
      status: 500,
      message: 'Error creating user',
      error: error.message
    })
  }
});

export default router;