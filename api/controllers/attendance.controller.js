import Attendance from '../models/attendance.model.js';
import Course from '../models/course.model.js';
import Student from '../models/student.model.js';
import { errorHandler } from '../utils/error.js';


// Start attendance window for a course on a specific date
export const startAttendance = async (req, res, next) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if (!course || course.facultyId.toString() !== req.user.id) {
      return next(errorHandler(403, 'You are not authorized to start attendance for this course.'));
    }

    const today = new Date().toISOString().split('T')[0]; // Get current date (YYYY-MM-DD)
    let attendance = await Attendance.findOne({ courseId, date: today });

    if (attendance && attendance.isWindowOpen) {
      return next(errorHandler(400, 'Attendance window is already open.'));
    }

    if (!attendance) {
      attendance = new Attendance({
        courseId,
        date: today,
        students: [], // Students will be populated when they mark attendance
        isWindowOpen: true,
      });
    } else {
      attendance.isWindowOpen = true;
    }

    await attendance.save();
    res.status(200).json({ message: 'Attendance window opened successfully.', attendance });
  } catch (error) {
    next(error);
  }
};




// Close attendance window for a course on a specific date
export const closeAttendance = async (req, res, next) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if (!course || course.facultyId.toString() !== req.user.id) {
      return next(errorHandler(403, 'You are not authorized to close attendance for this course.'));
    }

    const today = new Date().toISOString().split('T')[0];
    const attendance = await Attendance.findOne({ courseId, date: today });

    if (!attendance || !attendance.isWindowOpen) {
      return next(errorHandler(400, 'No open attendance window found for today.'));
    }

    attendance.isWindowOpen = false;
    await attendance.save();

    res.status(200).json({ message: 'Attendance window closed successfully.' });
  } catch (error) {
    next(error);
  }
};



// Get all students registered for a course
export const getStudentsByCourse = async (req, res, next) => {
  const { courseId } = req.params;
  try {
    const students = await Student.find({ courses: courseId });
    //console.log(students); 
    if (!students || students.length === 0) {
      return res.status(404).json({ message: 'No students found for this course.' });
    }

    res.status(200).json({ students });
  } catch (error) {
    next(error);
  }
};



// Submit attendance for a course on a specific date
export const markAttendance = async (req, res, next) => {
  const { courseId } = req.params;
  const { students } = req.body; // Expects { students: [{ studentId, status }] }
  
  try {
    const today = new Date().toISOString().split('T')[0];
    const attendance = await Attendance.findOne({ courseId, date: today });

    if (attendance) {
      console.log('if')
      // If record exists, check if window is open and update attendance
      if (!attendance.isWindowOpen) {
        return next(errorHandler(400, 'Attendance window is closed.'));
      }
      attendance.students = students;
    } else {
      console.log('else')
      // If no record exists, create a new one if window is open
      attendance = new Attendance({
        courseId,
        date: today,
        students,
        isWindowOpen: true,
      });
    }
    await attendance.save();

    // if (!attendance || !attendance.isWindowOpen) {
    //   return next(errorHandler(400, 'Attendance window is closed or not opened.'));
    // }
    // console.log('till here ok')
    // // Update attendance for the day
    // attendance.students = students; // Expects array of students with their attendance status
    // await attendance.save();

    const presentCount = students.filter(s => s.status === 'present').length;
    const absentCount = students.filter(s => s.status === 'absent').length;

    // Find the course and update attendance stats
    const course = await Course.findById(courseId);
    console.log(course)
    console.log(course.attendanceStats)
    let attendanceStat = course.attendanceStats.find(stat => stat.date.toISOString().split('T')[0] === today);
    
    if (attendanceStat) {
      console.log('already exists')
      // Update existing stats for the date
      attendanceStat.present = presentCount;
      attendanceStat.absent = absentCount;
    } else {
      console.log('new one')
      // Create new stats entry for the date
      const totalClassesHeld = course.attendanceStats.length
        ? course.attendanceStats[course.attendanceStats.length - 1].totalClassesHeld + 1
        : 1;
      const attendancePercentage = ((presentCount / totalClassesHeld) * 100).toFixed(2);
      
      attendanceStat = {
        date: today,
        present: presentCount,
        absent: absentCount,
        totalClassesHeld,
        attendancePercentage,
      };
      course.attendanceStats.push(attendanceStat);
    }
    await course.save();
    console.log(attendanceStat)

    
   
    // Update individual student attendance records
    for (const student of students) {
      const studentRecord = await Student.findById(student.studentId);
      let studentAttendance = studentRecord.attendance.find(a => a.date.toISOString().split('T')[0] === today && a.courseId.toString() === courseId);

      if (studentAttendance) {
        console.log('already exists')
        // Update existing student attendance
        studentAttendance.status = student.status;
      } else {
        console.log('new one')
        // Add new attendance entry for the date
        studentAttendance = {
          date: today,
          status: student.status,
          courseId,
        };
        studentRecord.attendance.push(studentAttendance);
      }

      // Calculate attendance percentage for the student in the course
      const totalAttendanceForCourse = studentRecord.attendance.filter(a => a.courseId.toString() === courseId).length;
      const totalPresentForCourse = studentRecord.attendance.filter(a => a.courseId.toString() === courseId && a.status === 'present').length;
      const attendancePercentage = ((totalPresentForCourse / totalAttendanceForCourse) * 100).toFixed(2);

      // Update the attendance percentage in the student model
      studentRecord.attendancePercentage.set(courseId, attendancePercentage);
      await studentRecord.save();
    }

    res.status(200).json({ message: 'Attendance marked successfully.', attendance });
  } catch (error) {
    next(error);
  }
};


 // Get attendance records for a specific course
 export const getAttendanceRecords = async (req, res, next) => {
  const { courseId } = req.params;

  try {
    const attendanceRecords = await Attendance.find({ courseId })
      .populate('students.studentId', 'name rollno') // Populate student details
      .sort({ date: -1 }); // Sort by date descending

    res.status(200).json(attendanceRecords);
  } catch (error) {
    next(error);
  }
};
