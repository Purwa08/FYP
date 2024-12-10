import Student from '../models/student.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const studentSignup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newStudent = new Student({ username, email, password: hashedPassword });
    try {
        await newStudent.save();
        res.status(201).json('Student created successfully!');
    } catch (error) {
        next(error);
    }
};

export const studentSignin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validStudent = await Student.findOne({ email });
        if (!validStudent) return next(errorHandler(404, 'Student not found!'));
        // const validPassword = bcryptjs.compareSync(password, validStudent.password);
        // if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));
        if (password !== validStudent.password) {
            return next(errorHandler(401, 'Wrong credentials!'));
        }
        const token = jwt.sign({ id: validStudent._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = validStudent._doc;
        res
            .status(200)
            .json({ token, student: rest }); // Return token and student data
    } catch (error) {
        next(error);
    }
};
