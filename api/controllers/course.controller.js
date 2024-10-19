import Course from '../models/course.model.js';

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
    const { name, description } = req.body;
    const facultyId = req.user.id; // Again, assuming req.user is available
    const newCourse = new Course({ name, description, facultyId });

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    next(err);
  }
};
