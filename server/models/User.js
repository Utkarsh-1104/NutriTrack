import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  currentWeight: {
    type: Number,
    required: true,
  },
  targetWeight: {
    type: Number,
    required: true,
  },
  calorieGoal: {    
    type: Number,
    required: true,
  },

  calorieLogs: [
    {
      date: {       
        type: String,
        required: true,
      },
      totalCalories: {
        type: Number,
        default: 0,
      },
      foods: [       
        {
          foodName: String,
          calories: Number,
        }
      ]
    }
  ]
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;