import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({

  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true },

  date: { 
    type: Date, 
    required: true },

  students: [
    {
      studentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Student', required: true },
      status: { 
        type: String, 
        enum: ['present', 'absent'], 
        required: true },
    },
  ],
});

const Attendance = mongoose.model('Attendance', AttendanceSchema);

export default Attendance;

