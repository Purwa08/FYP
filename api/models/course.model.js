import mongoose from 'mongoose';

const AttendanceStatSchema = new mongoose.Schema({
  date: { 
    type: Date, 
    required: true 
  },
  present: { 
    type: Number, 
    required: true 
  },
  absent: { 
    type: Number, 
    required: true 
  },
  totalClassesHeld: { 
    type: Number, 
    default: 0 
  },
  attendancePercentage: { 
    type: Number, 
    default: 0 
  },
});

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true
    },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    geofence: {
      // Example of how you can store geofencing parameters
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
      radius: {
        type: Number, // Radius in meters
        required: true,
      },
    },
    enrolledStudents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    }],
    attendanceStats: [AttendanceStatSchema]
  },
  
  {
    timestamps: true,
  }
);

const Course = mongoose.model('Course', courseSchema);

export default Course;
