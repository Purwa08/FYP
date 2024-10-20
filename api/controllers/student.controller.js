// controllers/student.controller.js
import fs from 'fs';
import csv from 'csv-parser';
import Student from '../models/student.model.js';
import Course from '../models/course.model.js'; 

// Import students from CSV
export const importStudents = (req, res, next) => {
  const courseId = req.params.id; // Get the course ID from the URL parameter
  const results = [];

  // Create a read stream for the uploaded file
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data)) // Push each row into the results array
    .on('end', async () => {
      try {
        const studentPromises = results.map(async (studentData) => {
          const { name, email, studentId } = studentData; // Destructure student data
          const newStudent = new Student({ name, email, studentId });
          await newStudent.save(); // Save the new student to the database
          return newStudent._id; // Return the new student's ID
        });

        const studentIds = await Promise.all(studentPromises);
        
        // Associate students with the course
        await Course.findByIdAndUpdate(courseId, { $addToSet: { enrolledStudents: { $each: studentIds } } });

        res.status(200).json({ message: 'Students imported successfully!', students: studentIds });
      } catch (error) {
        next(error);
      } finally {
        fs.unlinkSync(req.file.path); // Remove the uploaded file after processing
      }
    });
};

import crypto from 'crypto'; // Import crypto module to generate random passwords

// Function to generate a random password
const generateRandomPassword = (length = 8) => {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex') // Convert to hex string
    .slice(0, length); // Return only the specified length
};

export const addStudentToCourse = async (req, res, next) => {
  try {
    const { name, email, rollno } = req.body;

    // Check if the course exists
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if the student already exists
    let student = await Student.findOne({ email });
    
    if (student) {
      // If the student already exists, check if they are already enrolled in the course
      if (student.courses.includes(course._id)) {
        return res.status(400).json({ message: 'Student is already enrolled in this course' });
      }
      
      // If not, add the new course ID to their courses array
      student.courses.push(course._id);
      await student.save();
    } else {
      // Create a new student if they do not exist
      student = new Student({
        name,
        email,
        rollno,
        password: generateRandomPassword(), // Generate a random password
        courses: [course._id], // Add the course ID to the courses array
      });

      await student.save();
    }

    // Add the student to the course's enrolled students
    if (!course.enrolledStudents.includes(student._id)) {
      course.enrolledStudents.push(student._id);
      await course.save();
    }

    res.status(201).json({ message: 'Student added successfully', student });
  } catch (error) {
    next(error);
  }
};

