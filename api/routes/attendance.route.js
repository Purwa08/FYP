import express from 'express';
import {
  startAttendance,
  closeAttendance,
  markAttendance,
  getAttendanceRecords,
  getStudentsByCourse,
  getAttendanceByDate,
  getAttendanceSummary,
  isAttendanceWindowOpen,
  markAttendanceByStudent,
  getRealTimeAttendanceStatus
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


// Route to get attendance records for a specific course on a particular date
router.get('/course/:courseId/date/:date', verifyToken, getAttendanceByDate);


// Route for fetching attendance summary of a student
router.get('/student/:studentId', getAttendanceSummary);


// Check if attendance window is open for a specific course
router.get('/course/:courseId/window-status', isAttendanceWindowOpen);


// Route for a student to mark their attendance
router.post('/course/:courseId/student-mark-attendance', markAttendanceByStudent);


// Route to get real-time attendance status for a course
router.get("/course/:courseId/real-time-status", verifyToken, getRealTimeAttendanceStatus);

export default router;
