# NutriTrack

**NutriTrack** is a food calorie tracking web app that helps users monitor their daily caloric intake, track their weight goals, and maintain nutrition targets (calories, protein, and water). The app features a profile page, user authentication, and automatic calorie tracking with a daily reset.

---

## 🌟 Features

### 1. **User Authentication (JWT)**
- **Signup**: New users can sign up with their email, password, and weight data.
- **Login**: Returning users can log in securely with JWT authentication.
- **JWT Authentication**: Provides secure access to the user profile and calorie data.

### 2. **Profile Page**
- Users can view and manage their:
  - **Current Weight**
  - **Target Weight**
  - **Caloric Goal** (calorie deficit, maintenance, or surplus)
  - **Nutrition Goals** (calories, protein, water intake)

### 3. **Track Food and Calories**
- **Food Input**: Users can enter the foods they've eaten.
- **Calorie Calculation**: Fetches food calorie information from **Nutritionix API** based on the food entered.
- **Daily Calorie Total**: Automatically calculates the total calories consumed each day.
- **Food List**: Displays all food items entered along with their calorie content.

### 4. **Day-wise Calorie History**
- Users can view their total calories consumed each day, with a reset happening automatically every 24 hours.

---

## 🚀 Tech Stack

- **Frontend**: Next.js, TypeScript, Axios
- **Backend**: Node.js, Express, JWT Authentication, Bcrypt
- **Database**: MongoDB (Mongoose)
- **External API**: Nutritionix API for calorie data
- **Deployment**: Hosted on Render

---

## 📋 Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/nutritrack.git
cd nutritrack
```

### 2. Install Dependencies

- Frontend (Next.js with TypeScript)
```bash
cd frontend
npm install
```

- Backend (Node.js / Express)
```bash
cd backend
npm install
```

### 3. Configure Environment Variables
Create a .env file in both frontend and backend directories with the following variables:

- Frontend .env
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

- Backend .env
```bash
JWT_SECRET=your_jwt_secret_key
MONGO_URI=your_mongo_database_url
NUTRITIONIX_APP_ID=your_nutritionix_app_id
NUTRITIONIX_APP_KEY=your_nutritionix_app_key
```

### 4. Run the Development Server

- To run the frontend in development mode:
```bash
cd frontend
npm run dev
```
- To run the backend server:
```bash
cd backend
npm run dev
```

## Future Improvements
- Food Search: Add autocomplete for food search to make it easier for users to add food.
- Implement history for viewing past data.
- Macronutrient Tracking: Track additional macronutrients like carbs and fats.

