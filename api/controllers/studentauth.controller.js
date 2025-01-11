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

        // Check if it's the student's first login
        const isFirstLogin = validStudent.firstLogin;

        // Check if it's the student's first login
        // if (validStudent.firstLogin) {
        //     return res.status(200).json({
        //         message: "First time login, please reset your password",
        //         firstLogin: true,
        //         student: {
        //             id: validStudent._id,
        //             email: validStudent.email,
        //             name: validStudent.name, // Add more details as needed
        //             // Add any other fields you want to include
        //         }
        //     });
        // }

        // const validPassword = bcryptjs.compareSync(password, validStudent.password);
        // if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));

        if (!isFirstLogin && password !== validStudent.password) {
            return next(errorHandler(401, 'Wrong credentials!'));
        }

        const token = jwt.sign({ id: validStudent._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = validStudent._doc;
        res
            .status(200)
            .json({ token, student: rest,
                firstLogin: isFirstLogin, // Include firstLogin field in the response
                message: isFirstLogin ? "First time login, please reset your password" : "Login successful" }); // Return token and student data
    } catch (error) {
        next(error);
    }
};



export const resetPassword = async (req, res, next) => {
    const { studentId } = req.params;
    const { newPassword } = req.body;

    try {
        const student = await Student.findById(studentId);

        if (!student) {
            return next(errorHandler(404, 'Student not found!'));
        }

        // Validate new password (you can add more complex password validation if needed)
        if (!newPassword || newPassword.length < 6) {
            return next(errorHandler(400, 'Password must be at least 6 characters long.'));
        }

        // Hash the new password before saving it
        //const hashedPassword = bcryptjs.hashSync(newPassword, 10);

        // Update the password and mark the student as having completed first login
        student.password = newPassword;
        student.firstLogin = false;  // Mark as not first login anymore

        await student.save(); // Save the updated student

        console.log(student)

        res.status(200).json({ success: true,message: 'Password reset successful. You can now log in with your new password.' });
    } catch (error) {
        next(error);
    }
};
