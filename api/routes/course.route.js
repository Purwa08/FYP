import express from 'express';
import { getCourses, addCourse } from '../controllers/course.controller.js';
import { verifyToken } from '../utils/verifyUser.js'; // Assuming you have auth middleware

const router = express.Router();

// Route to get all courses for a specific faculty
router.get('/getcourses', verifyToken, getCourses);

// Route to add a new course
router.post('/addcourse', verifyToken, addCourse);

export default router;
