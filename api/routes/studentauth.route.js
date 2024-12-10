import express from 'express';
import { studentSignup, studentSignin } from '../controllers/studentauth.controller.js';

const router = express.Router();

// Routes for student authentication
router.post('/signup', studentSignup);
router.post('/signin', studentSignin);

export default router;
