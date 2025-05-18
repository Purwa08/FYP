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
    // geofence: {
    //   // Example of how you can store geofencing parameters
    //   latitude: {
    //     type: Number,
    //     required: true,
    //   },
    //   longitude: {
    //     type: Number,
    //     required: true,
    //   },
    //   radius: {
    //     type: Number, // Radius in meters
    //     required: true,
    //   },
    // },
    geofence: {
      circle: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        radius: { type: Number, required: true }, // Radius in meters
      },
      polygon: {
        type: {
          coordinates: {
            type: [[Number]], // Array of [latitude, longitude] pairs
            validate: {
              validator: function (v) {
                return v.length >= 3; // A valid polygon must have at least 3 points
              },
              message: "Polygon must have at least 3 coordinates",
            },
          },
          //required: false,
        },
      },
    },
    enrolledStudents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    }],

    attendanceStats: [AttendanceStatSchema],

    totalClassesHeld: { 
      type: Number, 
      default: 0 
    },
  },
  
  {
    timestamps: true,
  }
);

const Course = mongoose.model('Course', courseSchema);

export default Course;
