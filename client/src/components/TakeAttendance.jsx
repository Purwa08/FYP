// import React, { useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { useLocation } from 'react-router-dom'; // Ensure this line is present

// const TakeAttendance = () => {
//   const location = useLocation();
//   const courseName = location.state?.courseName; // Get the course name from state

//   const { id } = useParams(); // Get course ID from the URL
//   const [date, setDate] = useState(''); // State for date input
//   const [students, setStudents] = useState([]); // State to hold student attendance data

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const attendanceData = {
//       courseId: id,
//       date: new Date(date), // Convert date string to Date object
//       students: students.map(studentId => ({
//         studentId,
//         status: 'present', // or get status from user input
//       })),
//     };

//     try {
//       const res = await fetch('/api/attendance/take', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(attendanceData),
//       });
//       if (res.ok) {
//         console.log('Attendance taken successfully!');
//       } else {
//         console.error('Error taking attendance:', res.statusText);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div>
//       <h1>Take Attendance for Course {courseName || 'Loading..'}</h1>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Date:
//           <input
//             type="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//             required
//           />
//         </label>
//         {/* Render student attendance checkboxes here */}
//         <button type="submit">Submit Attendance</button>
//       </form>
//     </div>
//   );
// };

// export default TakeAttendance;


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const TakeAttendance = () => {
  const { courseId } = useParams(); // Get course ID from URL
  const [students, setStudents] = useState([]);
  const [attendanceWindowOpen, setAttendanceWindowOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState({}); // To hold attendance status

  // Fetch enrolled students for the course
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`/api/attendance/course/${courseId}/students`);
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [courseId]);

  // Toggle attendance window
  const handleAttendanceWindowToggle = () => {
    setAttendanceWindowOpen(!attendanceWindowOpen);
  };

  // Handle attendance status change
  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // Submit attendance
  const handleSubmitAttendance = async () => {
    try {
      const response = await fetch(`/api/attendance/course/${courseId}/mark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: new Date().toISOString(),
          students: Object.keys(attendanceData).map(studentId => ({
            studentId,
            status: attendanceData[studentId],
          })),
        }),
      });

      if (response.ok) {
        alert('Attendance marked successfully!');
        // Reset attendance data
        setAttendanceData({});
      } else {
        alert('Failed to mark attendance.');
      }
    } catch (error) {
      console.error("Error submitting attendance:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Take Attendance</h1>
      <button 
        onClick={handleAttendanceWindowToggle} 
        className={`mb-4 py-2 px-4 rounded ${attendanceWindowOpen ? 'bg-red-500' : 'bg-green-500'} text-white`}
      >
        {attendanceWindowOpen ? 'Close Attendance Window' : 'Start Attendance Window'}
      </button>

      {attendanceWindowOpen && (
        <div className="border border-gray-300 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Students</h2>
          <ul>
            {students.map(student => (
              <li key={student._id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  onChange={(e) => handleAttendanceChange(student._id, e.target.checked ? 'present' : 'absent')}
                  className="mr-2"
                />
                {student.name} - {student.rollno}
              </li>
            ))}
          </ul>
          <button 
            onClick={handleSubmitAttendance}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
          >
            Submit Attendance
          </button>
        </div>
      )}
    </div>
  );
};

export default TakeAttendance;
