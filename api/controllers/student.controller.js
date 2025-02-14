import Student from '../models/student.model.js';
import Course from '../models/course.model.js'; 
import { generateRandomPassword } from '../utils/password.js';
import XLSX from 'xlsx';
import crypto from 'crypto'; // Import crypto module to generate random passwords
import { errorHandler } from '../utils/error.js';

// Function to generate a random password
// const generateRandomPassword = (length = 8) => {
//   return crypto.randomBytes(Math.ceil(length / 2))
//     .toString('hex') // Convert to hex string
//     .slice(0, length); // Return only the specified length
// };

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



const columnMapping = {
  name: ['Name', 'name', 'NAME', 'Student Name'],
  email: ['Email', 'email', 'EMAIL'],
  rollno: ['Roll No', 'rollno', 'Roll Number', 'ROLLNO'],
};

const normalizeColumns = (data) => {
  const normalizedData = [];

  for (const row of data) {
    const normalizedRow = {};
    for (const key in row) {
      const normalizedKey = Object.keys(columnMapping).find((field) =>
        columnMapping[field].includes(key)
      );

      if (normalizedKey) {
        normalizedRow[normalizedKey] = row[key]; // Map the key to the normalized name
      }
    }
    normalizedData.push(normalizedRow);
  }

  return normalizedData;
};

export const handleFileUpload = async (req, res, next) => {
  try {
    const filePath = req.file.path;

    // Read Excel file and parse it
    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const studentData = XLSX.utils.sheet_to_json(worksheet);

    // Normalize columns
    const normalizedData = normalizeColumns(studentData);

    // Check if the course exists
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    for (const row of normalizedData) {
      const { name, email, rollno } = row;

      // Validate required fields
      if (!name || !email || !rollno) {
        errors.push(`Missing data for student: ${JSON.stringify(row)}`);
        continue; // Skip this row if required data is missing
      }

      // Check if the student already exists
      let student = await Student.findOne({ email });

      if (student) {
        // If student exists, ensure course is in their courses array
        if (!student.courses.includes(course._id)) {
          student.courses.push(course._id);
          await student.save();
        }
      } else {
        // If student does not exist, create a new student with random password
        const password = generateRandomPassword();
        student = new Student({
          name,
          email,
          rollno,
          password,
          courses: [course._id],
        });
        await student.save();
      }

      // Add student to course's enrolled students if not already present
      if (!course.enrolledStudents.includes(student._id)) {
        course.enrolledStudents.push(student._id);
      }
    }

    await course.save();
    res.status(200).json({ message: 'Students added successfully' });
  } catch (error) {
    next(error);
  }
};


export const getStudentCourseDetails = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId).populate('facultyId');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    //console.log("course details returned: ", course);

    res.status(200).json(course);
  } catch (err) {
    next(err);
  }
};



// Controller to update student profile
export const updateStudentProfile = async (req, res, next) => {
  const { studentId } = req.params;
  const { name, phone, profileImage, batch, branch, year, semester } = req.body;

  try {
    // Find the student by ID
    const student = await Student.findById(studentId);

    if (!student) {
      return next(errorHandler(404, "Student not found."));
    }

    // Update fields only if provided
    if (name) student.name = name;
    if (phone) student.phone = phone;
    if (profileImage) student.profileImage = profileImage;
    if (batch) student.batch = batch;
    if (branch) student.branch = branch;
    if (year) student.year = year;
    if (semester) student.semester = semester;

    // Save the updated student
    await student.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      updatedProfile: student,
    });

  } catch (err) {
    next(err);
  }
};
