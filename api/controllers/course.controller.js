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

// // Add a student to a course
// export const addStudentToCourse = async (req, res, next) => {
//   try {
//     const { studentId, courseId } = req.body; // Expecting studentId and courseId in the request body
//     const course = await Course.findById(courseId);
//     const student = await Student.findById(studentId);

//     if (!course || !student) {
//       return res.status(404).json({ message: 'Course or Student not found' });
//     }

//     // Add student to course's enrolledStudents array
//     course.enrolledStudents.push(studentId);
//     await course.save();

//     // Optionally, add the course to the student's courses array
//     student.courses.push(courseId);
//     await student.save();

//     res.status(200).json({ message: 'Student added to course successfully' });
//   } catch (err) {
//     next(err);
//   }
// };

// Example: Mark attendance for a course
// export const markAttendance = async (req, res, next) => {
//   try {
//     const { courseId, studentId, status } = req.body; // Expecting courseId, studentId, and status in request body
//     const attendanceRecord = new Attendance({
//       courseId,
//       studentId,
//       date: new Date(),
//       status,
//     });

//     await attendanceRecord.save();
//     res.status(201).json(attendanceRecord);
//   } catch (err) {
//     next(err);
//   }
// };