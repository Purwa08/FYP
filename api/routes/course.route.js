import express from 'express';
import { getCourses, addCourse, getCourseDetails} from '../controllers/course.controller.js';
import { addStudentToCourse, handleFileUpload } from '../controllers/student.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// Route to get all courses for a specific faculty
router.get('/getcourses', verifyToken, getCourses);


// Route to add a new course
router.post('/addcourse', verifyToken, addCourse);

// Route to get course details by ID
router.get('/course/:id', verifyToken, getCourseDetails); // Updated to fetch course details

// Route to manually add a student to a course
router.post('/course/:id/add-student', verifyToken, addStudentToCourse);

// Route to handle Excel file upload for students
router.post('/course/:id/import-students', upload.single('file'), handleFileUpload);


export default router;
