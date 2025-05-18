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
    phone: {
      type: String,
      required: false, // Optional phone number
    },
    profileImage: {
      type: String,
      default: "", // Default empty if not uploaded
    },
    firstLogin: {
      type: Boolean,
      default: true
    },
    rollno: {
      type: String, 
      required: true,
      unique: true
    },
    idNumber: {
      type: String,
      //required: true,
      unique: true, // Unique ID number for each student
    },
    batch: {
      type: String,
      //required: true, // e.g., "2021-2025"
    },
    branch: {
      type: String,
      //required: true, // e.g., "Computer Science", "Mechanical Engineering"
    },
    year: {
      type: Number,
      //required: true,
      enum: [1, 2, 3, 4], // Year of study
    },
    semester: {
      type: Number,
      //required: true,
      enum: [1, 2, 3, 4, 5, 6, 7, 8], // Semester number
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
        enum: ['present', 'absent'], // Track attendance status
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
    },

    // 📱 Device Binding Fields
    deviceId: {
      type: String,
      default: null, // Stores the device's unique ID after first login
    },
    deviceBoundAt: {
      type: Date,
      default: null, // Records when the device was bound
    }
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model('Student', studentSchema);
export default Student;
