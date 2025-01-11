// @ts-ignore
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import courseRouter from './routes/course.route.js';
import studentRouter from './routes/student.route.js'; 
import attendanceRouter from './routes/attendance.route.js';
import studentauthRouter from './routes/studentauth.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });

const app=express();

// CORS setup to allow specific origins and handle preflight requests
const corsOptions = {
  origin: ['http://localhost:8081', process.env.NGROK_URL], // Add ngrok URL dynamically from environment variables
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  credentials: true, // Allow cookies if needed
  allowedHeaders: ['Content-Type', 'ngrok-skip-browser-warning'],
};

app.use(cors(corsOptions)); // Use CORS middleware with options

app.use(express.json())

app.listen(3000, ()=>{
    console.log("server is running")
});
app.use(cookieParser()); 

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/courses', courseRouter);
app.use('/api/students', studentRouter);
app.use('/api/attendance',attendanceRouter);
app.use('/api/studentauth', studentauthRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});