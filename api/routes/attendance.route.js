import express from 'express';
import {
  startAttendance,
  closeAttendance,
  markAttendance,
  getAttendanceRecords,
  getStudentsByCourse
} from '../controllers/attendance.controller.js';
import { verifyToken } from '../utils/verifyUser.js'; // Assuming you have auth middleware

const router = express.Router();

// Route to start attendance window for a course
router.post('/course/:courseId/start-attendance', verifyToken, startAttendance);

// Route to close attendance window for a course
router.post('/course/:courseId/close-attendance', verifyToken, closeAttendance);

// Route to mark attendance for students in a course
router.put('/course/:courseId/mark-attendance', verifyToken, markAttendance);

// Route to get attendance records for a specific course
router.get('/course/:courseId/attendance', verifyToken, getAttendanceRecords);

// Fetch students enrolled in a specific course
router.get('/course/:courseId/students', verifyToken,  getStudentsByCourse);

export default router;
