// routes/student.routes.js
import express from 'express';
import { verifyToken } from '../utils/verifyUser.js'; // Middleware to verify token
import { getStudentCourseDetails, updateStudentProfile } from '../controllers/student.controller.js';

const router = express.Router();


// Route to fetch course details for a student
router.get('/course/:courseId', getStudentCourseDetails);

router.put('/student/:studentId/update-profile', updateStudentProfile);

export default router;
