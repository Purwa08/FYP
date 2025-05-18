import Attendance from '../models/attendance.model.js';
import Course from '../models/course.model.js';
import Student from '../models/student.model.js';
import { errorHandler } from '../utils/error.js';


// // Start attendance window for a course on a specific date(old one)
// export const startAttendance = async (req, res, next) => {
//   const { courseId } = req.params;
//   try {
//     const course = await Course.findById(courseId);
//     if (!course || course.facultyId.toString() !== req.user.id) {
//       return next(errorHandler(403, 'You are not authorized to start attendance for this course.'));
//     }

//     const today = new Date().toISOString().split('T')[0]; // Get current date (YYYY-MM-DD)
//     let attendance = await Attendance.findOne({ courseId, date: today });

//     if (attendance && attendance.isWindowOpen) {
//       return next(errorHandler(400, 'Attendance window is already open.'));
//     }

//     if (!attendance) {
//       attendance = new Attendance({
//         courseId,
//         date: today,
//         students: [], // Students will be populated when they mark attendance
//         isWindowOpen: true,
//       });

//       // Increment totalClassesHeld since this is a new class
//       course.totalClassesHeld = (course.totalClassesHeld || 0) + 1;

//       // Optionally update attendanceStats for per-day tracking (if still needed)
//       course.attendanceStats.push({
//         date: today,
//         present: 0,
//         absent: course.enrolledStudents.length, // Initially all absent
//         totalClassesHeld: course.totalClassesHeld,
//         attendancePercentage: 0, // Will update as students mark present
//       });

//     } else {
//       attendance.isWindowOpen = true;
//     }

//     await attendance.save();

//     // Sync absences for all enrolled students
//     for (const student of course.enrolledStudents) {
//       const studentId = student._id.toString();
//       const studentRecord = await Student.findById(studentId);

//       const existingRecord = studentRecord.attendance.find(
//         (record) =>
//           record.date.toISOString().split("T")[0] === today &&
//           record.courseId.toString() === courseId
//       );

//       // If no record exists for this date and course, mark as absent
//       if (!existingRecord) {
//         studentRecord.attendance.push({
//           date: today,
//           courseId,
//           status: "absent", // Default to absent until marked present
//         });
//       }

//       // Recalculate attendance percentage
//       const totalPresent = studentRecord.attendance.filter(
//         (record) => record.courseId.toString() === courseId && record.status === "present"
//       ).length;
//       const attendancePercentage = (
//         (totalPresent / course.totalClassesHeld) * 100
//       ).toFixed(2);
//       studentRecord.attendancePercentage.set(courseId, attendancePercentage);

//       await studentRecord.save();
//     }

//     // Save the updated course (totalClassesHeld and attendanceStats)
//     await course.save();

//     res.status(200).json({ message: 'Attendance window opened successfully.', attendance });
//   } catch (error) {
//     next(error);
//   }
// };

//updated one
export const startAttendance = async (req, res, next) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId).populate("enrolledStudents");
    if (!course || course.facultyId.toString() !== req.user.id) {
      return next(errorHandler(403, "You are not authorized to start attendance for this course."));
    }

    const today = new Date().toISOString().split("T")[0];
    let attendance = await Attendance.findOne({ courseId, date: today });

    if (attendance && attendance.isWindowOpen) {
      return next(errorHandler(400, "Attendance window is already open."));
    }

    if (!attendance) {
      attendance = new Attendance({
        courseId,
        date: today,
        students: [],
        isWindowOpen: true,
      });

      course.totalClassesHeld = (course.totalClassesHeld || 0) + 1;
      course.attendanceStats.push({
        date: today,
        present: 0,
        absent: course.enrolledStudents.length,
        totalClassesHeld: course.totalClassesHeld,
        attendancePercentage: 0,
      });
    } else {
      attendance.isWindowOpen = true;
    }

    await attendance.save();

    // Sync absences for all enrolled students
    for (const student of course.enrolledStudents) {
      const studentId = student._id.toString();
      const studentRecord = await Student.findById(studentId);

      const existingRecord = studentRecord.attendance.find(
        (record) =>
          record.date.toISOString().split("T")[0] === today &&
          record.courseId.toString() === courseId
      );

      if (!existingRecord) {
        studentRecord.attendance.push({
          date: today,
          courseId,
          status: "absent",
        });
        // Set initial percentage to 0 since no one is present yet
        //studentRecord.attendancePercentage.set(courseId, 0);

        // Recalculate attendance percentage
    const totalPresentForCourse = studentRecord.attendance.filter(
      (record) => record.courseId.toString() === courseId && record.status === "present"
    ).length;
    const attendancePercentage = ((totalPresentForCourse / course.totalClassesHeld) * 100).toFixed(2);
    studentRecord.attendancePercentage.set(courseId, attendancePercentage);
    
        await studentRecord.save();
      }
    }

    await course.save(); // Save course updates

    res.status(200).json({ message: "Attendance window opened successfully.", attendance });
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






export const getAttendanceByDate = async (req, res) => {
  const { courseId, date } = req.params;
  console.log(`Received request for attendance on date: ${date}`);

  try {
    const selectedDate = new Date(date);
    
    // Find students with attendance records matching the course and date
    const students = await Student.find({
      attendance: {
        $elemMatch: {
          courseId,
          date: { $eq: selectedDate },
        },
      },
    }).select('name rollno attendance');

    // Separate students into present and absent lists
    const presentStudents = [];
    const absentStudents = [];

    students.forEach(student => {
      const attendanceRecord = student.attendance.find(
        record => 
          record.courseId.toString() === courseId && 
          record.date.toISOString() === selectedDate.toISOString()
      );

      if (attendanceRecord.status === 'present') {
        presentStudents.push(student);
      } else {
        absentStudents.push(student);
      }
    });

    res.json({ present: presentStudents, absent: absentStudents });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance data', error });
  }
};






// export const getAttendanceSummary = async (req, res) => {
//   const { studentId } = req.params;

//   try {
//     // Find the student and populate courses
//     const student = await Student.findById(studentId).populate('courses');

//     if (!student) {
//       return res.status(404).json({ message: 'Student not found' });
//     }

//     // Generate attendance summary for each course
//     const attendanceSummary = student.courses.map((course) => {
//       const courseId = course._id.toString();
//       return {
//         courseID: course.courseId,
//         courseName: course.name,
//         courseCode: course.code,
//         description: course.description,
//         attendancePercentage: student.attendancePercentage[courseId] || 0,
//         attendanceRecords: student.attendance
//           .filter((record) => record.courseId.toString() === courseId)
//           .map((record) => ({
//             date: record.date,
//             status: record.status,
//           })),
//       };
//     });

//     // Response with student details and attendance summary
//     res.status(200).json({
//       studentName: student.name,
//       rollno: student.rollno,
//       email: student.email,
//       attendanceSummary,
//     });
//   } catch (error) {
//     console.error('Error fetching attendance summary:', error.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// };



//old one
// export const getAttendanceSummary = async (req, res, next) => {
//   const { studentId } = req.params;

//   try {
//     // Find the student and populate courses
//     const student = await Student.findById(studentId).populate('courses');

//     if (!student) {
//       return res.status(404).json({ message: 'Student not found' });
//     }
 
//     // Generate attendance summary for each course
//     const attendanceSummary = student.courses.map((course) => {
//       const courseId = course._id.toString();
//       const courseAttendanceRecords = student.attendance.filter(
//         (record) => record.courseId.toString() === courseId
//       );

//       // Count sessions attended and missed
//       const totalSessions = courseAttendanceRecords.length;
//       const attendedSessions = courseAttendanceRecords.filter(
//         (record) => record.status === 'present'
//       ).length;
//       const missedSessions = courseAttendanceRecords.filter(
//         (record) => record.status === 'absent'
//       ).length;

//       return {
//         courseID: course._id,
//         courseName: course.name,
//         courseCode: course.code,
//         description: course.description,
//         attendancePercentage: student.attendancePercentage.get(courseId) || 0,
//         totalSessions,
//         attendedSessions,
//         missedSessions,
//         attendanceRecords: courseAttendanceRecords.map((record) => ({
//           date: record.date,
//           status: record.status,
//         })),
//       };
//     });

//     // Send response with student details and attendance summary
//     res.status(200).json({
//       studentName: student.name,
//       rollno: student.rollno,
//       email: student.email,
//       attendanceSummary,
//     });
//   } catch (error) {
//     console.error('Error fetching attendance summary:', error.message);
//     next(error); // Pass error to the Express error handler
//   }
// };


//new one by grok
export const getAttendanceSummary = async (req, res, next) => {
  const { studentId } = req.params;

  try {
    // Find the student and populate courses
    const student = await Student.findById(studentId).populate({
      path: "courses",
      select: "name code description totalClassesHeld", // Include totalClassesHeld
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Generate attendance summary for each course
    const attendanceSummary = student.courses.map((course) => {
      const courseId = course._id.toString();
      const courseAttendanceRecords = student.attendance.filter(
        (record) => record.courseId.toString() === courseId
      );

      // Use Course.totalClassesHeld as the total number of sessions
      const totalSessions = course.totalClassesHeld || 0;

      // Count sessions attended and missed from student's attendance records
      const attendedSessions = courseAttendanceRecords.filter(
        (record) => record.status === "present"
      ).length;
      const missedSessions = courseAttendanceRecords.filter(
        (record) => record.status === "absent"
      ).length;

      // Use the precomputed attendancePercentage from the Student model
      const attendancePercentage = student.attendancePercentage.get(courseId) || 0;

      return {
        courseID: course._id,
        courseName: course.name,
        courseCode: course.code,
        description: course.description,
        attendancePercentage: parseFloat(attendancePercentage), // Ensure it’s a number
        totalSessions,
        attendedSessions,
        missedSessions,
        attendanceRecords: courseAttendanceRecords.map((record) => ({
          date: record.date,
          status: record.status,
        })),
      };
    });

    // Send response with student details and attendance summary
    res.status(200).json({
      studentName: student.name,
      rollno: student.rollno,
      email: student.email,
      attendanceSummary,
    });
  } catch (error) {
    console.error("Error fetching attendance summary:", error.message);
    next(error); // Pass error to the Express error handler
  }
};





// Check if attendance window is open for a specific course and date
export const isAttendanceWindowOpen = async (req, res, next) => {
  const { courseId } = req.params;
  const { studentId } = req.query;

  try {
    const today = new Date().toISOString().split('T')[0]; // Get today's date (YYYY-MM-DD)
    const attendance = await Attendance.findOne({ courseId, date: today }); // Find attendance record for the course and today

    if (!attendance) {
      return res.status(404).json({ 
        isWindowOpen: false ,
        isAttendanceMarked: false,
        message: 'Attendance record not found for today.' });
    }

    // Check if the student has already marked attendance
    const isAttendanceMarked = attendance.students.some(
      (record) => record.studentId.toString() === studentId
    );

    // Return the status of the attendance window and whether attendance is marked
    res.status(200).json({
      isWindowOpen: attendance.isWindowOpen,
      isAttendanceMarked,
    });

    // Return the status of the attendance window
    //res.status(200).json({ isWindowOpen: attendance.isWindowOpen });
  } catch (error) {
    console.error('Error checking attendance window:', error.message);
    next(error);
  }
};


//old one imp
// Controller for students to mark their attendance
// export const markAttendanceByStudent = async (req, res, next) => {
//   const { courseId } = req.params;
//   const { studentId } = req.body; // Student ID passed in the request body (can also come from token)
//   const today = new Date().toISOString().split("T")[0]; // Current date in YYYY-MM-DD format

//   try {
//     // Step 1: Check if the course exists
//     const course = await Course.findById(courseId);
//     if (!course) {
//       return next(errorHandler(404, "Course not found."));
//     }

//     // Step 2: Check if the student is enrolled in the course
//     const isEnrolled = course.enrolledStudents.some(
//       (id) => id.toString() === studentId
//     );
//     if (!isEnrolled) {
//       return next(errorHandler(403, "You are not enrolled in this course."));
//     }

//     // Step 3: Check if attendance window is open for the course today
//     let attendance = await Attendance.findOne({ courseId, date: today });
//     if (!attendance || !attendance.isWindowOpen) {
//       return next(errorHandler(400, "Attendance window is closed."));
//     }

//     // Step 4: Check if the student has already marked attendance for today
//     const alreadyMarked = attendance.students.some(
//       (record) => record.studentId.toString() === studentId && record.status==="present"
//     );
//     if (alreadyMarked) {
//       return next(errorHandler(400, "You have already marked attendance."));
//     }

//     // Step 5: Mark the student as present
//     attendance.students.push({
//       studentId,
//       status: "present",
//     });
//     await attendance.save();

//     //step course model update
//     // Update the course model attendance stats
//     const existingStat = course.attendanceStats.find(
//       (stat) => stat.date.toISOString().split('T')[0] === today
//     );

//     if (existingStat) {
//       // Update existing stats for the date
//        existingStat.present += 1;
//        existingStat.attendancePercentage = ((existingStat.present/existingStat.totalClassesHeld)*100).toFixed(2);
      
//     } else {
//       // Create new stats entry for the date
//       course.totalClassesHeld += 1;
//       const totalClassesHeld =course.totalClassesHeld;
//       // const totalClassesHeld = course.attendanceStats.length
//       //   ? course.attendanceStats[course.attendanceStats.length - 1].totalClassesHeld + 1
//       //   : 1;
//       const presentCount = 1;
//       const absentCount=0;
//       //const presentCount = status === 'present' ? 1 : 0;
//       //const absentCount = status === 'absent' ? 1 : 0;
//       const attendancePercentage = ((presentCount / totalClassesHeld) * 100).toFixed(2);

//       course.attendanceStats.push({
//         date: today,
//         present: presentCount,
//         absent: absentCount,
//         totalClassesHeld,
//         attendancePercentage,
//       });
//     }
//     await course.save();

//     // Step 6: Update the student's attendance record
//     const student = await Student.findById(studentId);
//     const existingRecord = student.attendance.find(
//       (record) =>
//         record.date.toISOString().split("T")[0] === today &&
//         record.courseId.toString() === courseId
//     );

//     if (!existingRecord) {
//       student.attendance.push({
//         date: today,
//         courseId,
//         status: "present",
//       });
//     }
//     else {
//       // Update existing attendance entry
//       existingRecord.status = "present";
//     }

//     // Step 7: Update the student's attendance percentage for the course
//     // const totalAttendanceForCourse = student.attendance.filter(
//     //   (record) => record.courseId.toString() === courseId
//     // ).length;

//     // const totalPresentForCourse = student.attendance.filter(
//     //   (record) =>
//     //     record.courseId.toString() === courseId && record.status === "present"
//     // ).length;

//     // const attendancePercentage = (
//     //   (totalPresentForCourse / totalAttendanceForCourse) *
//     //   100
//     // ).toFixed(2);

//     // student.attendancePercentage.set(courseId, attendancePercentage);
//     // await student.save();

//     // Recalculate attendance percentage
//     const totalPresentForCourse = student.attendance.filter(
//       (record) => record.courseId.toString() === courseId && record.status === "present"
//     ).length;
//     const attendancePercentage = ((totalPresentForCourse / course.totalClassesHeld) * 100).toFixed(2);
//     student.attendancePercentage.set(courseId, attendancePercentage);
//     await student.save();

//     res
//       .status(200)
//       .json({ message: "Attendance marked successfully.", attendance });
//   } catch (error) {
//     next(error);
//   }
// };

//new updated one by grok
export const markAttendanceByStudent = async (req, res, next) => {
  const { courseId } = req.params;
  const { studentId } = req.body;
  const today = new Date().toISOString().split("T")[0];

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return next(errorHandler(404, "Course not found."));
    }

    const isEnrolled = course.enrolledStudents.some((id) => id.toString() === studentId);
    if (!isEnrolled) {
      return next(errorHandler(403, "You are not enrolled in this course."));
    }

    let attendance = await Attendance.findOne({ courseId, date: today });
    if (!attendance || !attendance.isWindowOpen) {
      return next(errorHandler(400, "Attendance window is closed."));
    }

    const alreadyMarked = attendance.students.some(
      (record) => record.studentId.toString() === studentId && record.status === "present"
    );
    if (alreadyMarked) {
      return next(errorHandler(400, "You have already marked attendance."));
    }

    attendance.students.push({ studentId, status: "present" });
    await attendance.save();

    // Update course attendance stats
    const existingStat = course.attendanceStats.find(
      (stat) => stat.date.toISOString().split("T")[0] === today
    );
    if (existingStat) {
      existingStat.present += 1;
      existingStat.absent -= 1; // Reflect one less absent student
      // Use course.totalClassesHeld for consistency, though this stat might not be student-specific
      existingStat.attendancePercentage = ((existingStat.present / course.totalClassesHeld) * 100).toFixed(2);
      await course.save();
    } // No else block needed—new stats should only be added in startAttendance

    // Update student's attendance record
    const student = await Student.findById(studentId);
    const existingRecord = student.attendance.find(
      (record) =>
        record.date.toISOString().split("T")[0] === today &&
        record.courseId.toString() === courseId
    );

    if (!existingRecord) {
      student.attendance.push({ date: today, courseId, status: "present" });
    } else {
      existingRecord.status = "present";
    }

    // Recalculate attendance percentage
    const totalPresentForCourse = student.attendance.filter(
      (record) => record.courseId.toString() === courseId && record.status === "present"
    ).length;
    const attendancePercentage = ((totalPresentForCourse / course.totalClassesHeld) * 100).toFixed(2);
    student.attendancePercentage.set(courseId, attendancePercentage);
    await student.save();

    res.status(200).json({ message: "Attendance marked successfully.", attendance });
  } catch (error) {
    next(error);
  }
};

// Get real-time attendance status for a course
// Get real-time attendance status for a course
export const getRealTimeAttendanceStatus = async (req, res, next) => {
  const { courseId } = req.params;
  const today = new Date().toISOString().split("T")[0]; // Current date (YYYY-MM-DD)

  try {
    // Step 1: Check if the course exists
    const course = await Course.findById(courseId).populate("enrolledStudents", "name rollno");
    if (!course) {
      return next(errorHandler(404, "Course not found."));
    }

    // Step 2: Check if attendance record exists for today
    const attendance = await Attendance.findOne({ courseId, date: today }).populate(
      "students.studentId",
      "name rollno"
    );

    if (!attendance) {
      return res.status(404).json({
        message: "No attendance record found for today.",
        isWindowOpen: false, // Explicitly indicate the attendance window is closed
        markedStudents: [],
        pendingStudents: course.enrolledStudents, // All students are pending
      });
    }

    // Step 3: Prepare the lists of marked and pending students
    const markedStudents = attendance.students.map((record) => ({
      studentId: record.studentId._id,
      name: record.studentId.name,
      rollno: record.studentId.rollno,
      status: record.status,
    }));

     // Log the marked students for debugging
     //console.log("Marked Students:", markedStudents);

    // Create a set of marked student IDs for quick lookup
    //const markedStudentIds = new Set(attendance.students.map((record) => record.studentId.toString()));
    // Corrected line to ensure we're using only the student IDs (as strings)
    const markedStudentIds = new Set(attendance.students.map((record) => record.studentId._id.toString()));

    // Log the set of marked student IDs
    //console.log("Marked Student IDs:", Array.from(markedStudentIds));
    

    // Step 4: Filter the course's enrolled students to find those who are not marked
    const pendingStudents = course.enrolledStudents.filter(
      (student) => !markedStudentIds.has(student._id.toString())
    );

    // Log the pending students for debugging
    //console.log("Pending Students:", pendingStudents);

    // Step 5: Return the real-time attendance data
    res.status(200).json({
      message: "Real-time attendance status fetched successfully.",
      isWindowOpen: attendance.isWindowOpen, // Include window status
      markedStudents,
      pendingStudents,
    });
  } catch (error) {
    console.error("Error fetching real-time attendance status:", error.message);
    next(error);
  }
};
