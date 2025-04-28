import express from "express";
import cors from "cors";

import { db } from "./db/db.js";
import signup from "./routes/signup.js";
import login from "./routes/login.js";
import add from "./routes/add.js";
import todayCal from "./routes/todayCal.js";
import history from "./routes/history.js";

import authMiddleware from "./middleware/authMiddleware.js";

const app = express(); 
app.use(cors());
app.use(express.json());

app.use("/api/signup", signup);
app.use("/api/login", login);
app.use("/api/add", authMiddleware, add);
app.use("/api/todaycal", authMiddleware, todayCal);
app.use("/api/history", authMiddleware, history);

app.get("/", async (req, res) => {
    await db();
    res.json({
        msg: "Hello World!"
    })
})

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
})