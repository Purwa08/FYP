import Course from '../models/course.model.js';
import Student from '../models/student.model.js';
import Attendance from '../models/attendance.model.js'

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

















