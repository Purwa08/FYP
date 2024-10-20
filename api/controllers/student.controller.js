// controllers/student.controller.js
import fs from 'fs';
import csv from 'csv-parser';
import Student from '../models/student.model.js';
import Course from '../models/course.model.js'; // Import the Course model

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
