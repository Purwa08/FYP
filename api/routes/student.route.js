// routes/student.routes.js
import express from 'express';
import { importStudents } from '../controllers/student.controller.js'; // Import the import function
import { verifyToken } from '../utils/verifyUser.js'; // Middleware to verify token
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Temporary directory for uploaded files

// Route to import students from CSV
router.post('/import/:id', verifyToken, upload.single('file'), importStudents);

export default router;
