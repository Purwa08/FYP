import Course from '../models/course.model.js';
import Student from '../models/student.model.js';
import Attendance from '../models/attendance.model.js'
import { createObjectCsvStringifier } from 'csv-writer'; 

// Get all courses for the logged-in faculty
export const getCourses = async (req, res, next) => {
  try {
    const facultyId = req.user.id; // Assuming req.user is populated after authentication
    const courses = await Course.find({ facultyId });
    res.status(200).json(courses);
  } catch (err) {
    next(err);
  }
};

// Add a new course
export const addCourse = async (req, res, next) => {
  try {
    const { name, description, code, latitude, longitude, radius} = req.body;
    const facultyId = req.user.id; // Again, assuming req.user is available
    const newCourse = new Course({ name, description, code, facultyId, geofence: {
      latitude,
      longitude,
      radius,
    }, });

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    next(err);
  }
};




// Get course details by ID
export const getCourseDetails = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId)
      .populate('enrolledStudents') // Populate to get student details if necessary
      .populate('facultyId'); // Populate to get faculty details if needed

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json(course);
  } catch (err) {
    next(err);
  }
};



// Controller to download student list as CSV
export const downloadStudentList = async (req, res, next) => {
  const courseId = req.params.id;

  try {
    // Find course and populate enrolled student details
    const course = await Course.findById(courseId).populate('enrolledStudents', 'rollno name email password'); // Only fetch necessary fields
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Prepare CSV content with headers
    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'rollno', title: 'Roll No' },
        { id: 'name', title: 'Name' },
        { id: 'email', title: 'Email' },
        { id: 'password', title: 'Password' },
      ]
    });

    // Map the student data into CSV rows
    const studentData = course.enrolledStudents.map(student => ({
      rollno: student.rollno,
      name: student.name,
      email: student.email,
      password: student.password,
    }));

    const csvContent = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(studentData);

    // Send CSV as downloadable response
    res.header('Content-Type', 'text/csv');
    res.attachment(`students_course_${courseId}.csv`);
    res.send(csvContent);
  } catch (error) {
    console.error("Error generating student list CSV:", error);
    res.status(500).json({ message: 'Error generating student list' });
  }
};


