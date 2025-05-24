require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

//Routes
const authRoutes = require("./routes/authRoutes");
const authRoutes = require("./routes/userRoutes");

const app = express();


app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods : ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
)

connectDB();

app.use(express.json());



//routea
app.use("/api/auth",authRoutes);
app.use("/api/users" , userRoutes);
// app.use("/api/tasks" , taskRoutes);
// app.use("/api/reports"   , reportRoutes);


const POST = process.env.POST || 5000;
app.listen(POST, () => { console.log(`Server is running on port ${POST}`) });
