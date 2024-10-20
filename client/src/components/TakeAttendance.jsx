import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom'; // Ensure this line is present

const TakeAttendance = () => {
  const location = useLocation();
  const courseName = location.state?.courseName; // Get the course name from state

  const { id } = useParams(); // Get course ID from the URL
  const [date, setDate] = useState(''); // State for date input
  const [students, setStudents] = useState([]); // State to hold student attendance data

  const handleSubmit = async (e) => {
    e.preventDefault();
    const attendanceData = {
      courseId: id,
      date: new Date(date), // Convert date string to Date object
      students: students.map(studentId => ({
        studentId,
        status: 'present', // or get status from user input
      })),
    };

    try {
      const res = await fetch('/api/attendance/take', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attendanceData),
      });
      if (res.ok) {
        console.log('Attendance taken successfully!');
      } else {
        console.error('Error taking attendance:', res.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Take Attendance for Course {courseName || 'Loading..'}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
        {/* Render student attendance checkboxes here */}
        <button type="submit">Submit Attendance</button>
      </form>
    </div>
  );
};

export default TakeAttendance;
