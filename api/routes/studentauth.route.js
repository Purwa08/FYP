import express from 'express';
import { studentSignup, studentSignin, resetPassword ,changePassword} from '../controllers/studentauth.controller.js';

const router = express.Router();

// Routes for student authentication
router.post('/signup', studentSignup);
router.post('/signin', studentSignin);
router.post('/reset-password/:studentId', resetPassword);
router.post('/change-password/:studentId', changePassword); // studentId passed in URL params

export default router;
