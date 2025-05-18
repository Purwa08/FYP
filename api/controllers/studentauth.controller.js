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
    const { email, password , deviceId } = req.body;

     // Ensure deviceId is provided
     if (!deviceId) {
        return next(errorHandler(400, 'Device ID is required.'));
    }

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

         // Device Binding Logic:
         if (!validStudent.deviceId) {
            // If no device is bound, bind this device (for first login or if somehow unbound)
            validStudent.deviceId = deviceId;
            validStudent.deviceBoundAt = new Date();

            // Optionally update the firstLogin flag if the flow requires a password reset only on the first login
            // if (isFirstLogin) {
            //     validStudent.firstLogin = false;
            // }

            await validStudent.save();
        } else if (validStudent.deviceId !== deviceId) {
            // If device is already bound and the incoming deviceId doesn't match, deny access
            return next(errorHandler(403, 'Access denied! This device is not authorized for this account.'));
        }

        const token = jwt.sign({ id: validStudent._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = validStudent._doc;
        res
            .status(200)
            .json({
                token, student: rest,
                firstLogin: isFirstLogin, // Include firstLogin field in the response
                message: isFirstLogin ? "First time login, please reset your password" : "Login successful"
            }); // Return token and student data
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

        res.status(200).json({ success: true, message: 'Password reset successful. You can now log in with your new password.' });
    } catch (error) {
        next(error);
    }
};



export const changePassword = async (req, res, next) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const { studentId } = req.params;

    if (!currentPassword || !newPassword || !confirmPassword) {
        return next(errorHandler(400, "Please provide all fields"));
    }

    if (newPassword !== confirmPassword) {
        return next(errorHandler(400, "New passwords do not match"));
    }

    if (newPassword.length < 6) {
        return next(errorHandler(400, "New password must be at least 6 characters long"));
    }

    try {
        // Verify the JWT token to get the current logged-in student's ID
        // const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;

        // if (!token) {
        //     return next(errorHandler(401, "Authorization token is missing"));
        // }
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // // Ensure the studentId from the URL matches the ID in the token
        // if (decoded.id !== studentId) {
        //     return next(errorHandler(403, "You are not authorized to change this password"));
        // }
        const student = await Student.findById(studentId);

        if (!student) {
            return next(errorHandler(404, "Student not found"));
        }

        //const isMatch = await bcryptjs.compare(currentPassword, student.password);
        const isMatch = student.password === currentPassword;

        if (!isMatch) {
            return next(errorHandler(401, "Current password is incorrect"));
        }

        //const hashedPassword = await bcryptjs.hash(newPassword, 10);

        //student.password = hashedPassword;
        student.password = newPassword;
        await student.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        next(error);
    }
};
