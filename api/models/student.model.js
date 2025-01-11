import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true, // Required for logging in
      },
      firstLogin: { 
        type: Boolean, 
        default: true 
      },
      rollno:{
        type: String,
        required: true,
        unique: true
      },
      courses: [{ // List of courses the student is enrolled in
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      }],
      attendance: [{
        date: {
          type: Date,
          required: true,
        },
        status: {
          type: String,
          enum: ['present', 'absent', 'late'], // Track attendance status
          required: true,
        },
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course', // Reference to the course for which attendance is marked
        },
      }],
      attendancePercentage: { // NEW FIELD
        type: Map,
        of: Number, // key: courseId, value: percentage
        default: {},
      }
    },
    {
      timestamps: true,
    }
  );
  
  const Student = mongoose.model('Student', studentSchema);
  export default Student;
