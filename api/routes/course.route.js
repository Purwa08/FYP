import express from 'express';
import { getCourses, addCourse, getCourseDetails, addStudentToCourse, markAttendance } from '../controllers/course.controller.js';
import { verifyToken } from '../utils/verifyUser.js'; // Assuming you have auth middleware

const router = express.Router();

// Route to get all courses for a specific faculty
router.get('/getcourses', verifyToken, getCourses);

// Route to add a new course
router.post('/addcourse', verifyToken, addCourse);

// Route to get course details by ID
router.get('/course/:id', verifyToken, getCourseDetails); // Updated to fetch course details

// Route to add a student to a course
router.post('/addstudent', verifyToken, addStudentToCourse); // New route for adding students

// Route to mark attendance for a course
router.post('/mark-attendance', verifyToken, markAttendance); // New route for marking attendance

export default router;
