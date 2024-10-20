import express from 'express';
import Attendance from '../models/attendance.model.js';

const router = express.Router();

// Route to take attendance
router.post('/take', async (req, res) => {
  const { courseId, date, students } = req.body;

  try {
    const attendance = new Attendance({
      courseId,
      date,
      students,
    });

    await attendance.save();
    res.status(201).json({ message: 'Attendance recorded successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error recording attendance', error });
  }
});

export default router;
