import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CourseDetails = () => {
  const { id } = useParams(); // Get course ID from the URL
  const [course, setCourse] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState([]);
  const navigate = useNavigate();

  // Fetch course details and attendance statistics
  const fetchCourseDetails = async () => {
    try {
      const res = await fetch(`/api/courses/course/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await res.json();
      setCourse(data);
      setAttendanceStats(data.attendanceStats || []); // Assuming attendance stats are part of course data
    } catch (error) {
      console.error('Error fetching course details:', error);
    }
  };

  useEffect(() => {
    console.log('Fetching course details for ID:', id);
    fetchCourseDetails();
  }, [id]);

  // Handle navigation to take attendance page
  // const handleTakeAttendance = () => {
  //   navigate(`/take-attendance/${id}`);
  // };

  const handleTakeAttendance = () => {
    navigate(`/take-attendance/${id}`, { state: { courseName: course.name } });
  };
  

  // Handle navigation to add student page
  const handleAddStudent = () => {
    navigate(`/add-student/${id}`);
  };

  if (!course) {
    return <div className="text-center">Loading...</div>; // Show loading while fetching data
  }

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-3xl font-bold text-center mb-8">{course.name}</h1>
      <div className="mb-5">
        <h2 className="text-xl font-semibold">Course Code: {course.code}</h2>
        <p className="text-gray-600">{course.description}</p>
      </div>

      <div className="mb-5">
        <h2 className="text-lg font-semibold">Geofencing Parameters</h2>
        <p><strong>Latitude:</strong> {course.geofence.latitude}</p>
        <p><strong>Longitude:</strong> {course.geofence.longitude}</p>
        <p><strong>Radius:</strong> {course.geofence.radius} meters</p>
      </div>

      <div className="mb-5">
        <h2 className="text-lg font-semibold">Attendance Statistics</h2>
        {attendanceStats.length > 0 ? (
          <ul className="list-disc list-inside">
            {attendanceStats.map((stat, index) => (
              <li key={index}>
                {stat.date}: {stat.present} Present, {stat.absent} Absent
              </li>
            ))}
          </ul>
        ) : (
          <p>No attendance records available.</p>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={handleTakeAttendance}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Take Attendance
        </button>
        <button
          onClick={handleAddStudent}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Student Manually
        </button>
      </div>
    </div>
  );
};

export default CourseDetails;



















// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Bar } from 'react-chartjs-2'; // For the bar chart
// import 'react-calendar/dist/Calendar.css'; // If using react-calendar
// import Calendar from 'react-calendar';

// const CourseDetails = () => {
//   const { id } = useParams();
//   const [course, setCourse] = useState(null);
//   const [attendanceStats, setAttendanceStats] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [lowAttendance, setLowAttendance] = useState([]);
//   const navigate = useNavigate();

//   // Fetch course details and attendance stats
//   const fetchCourseDetails = async () => {
//     try {
//       const res = await fetch(`/api/courses/course/${id}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//       });
//       const data = await res.json();
//       setCourse(data);
//       setAttendanceStats(data.attendanceStats || []);
//     } catch (error) {
//       console.error('Error fetching course details:', error);
//     }
//   };

//   // Fetch students for the course
//   const fetchStudents = async () => {
//     try {
//       const res = await fetch(`/api/attendance/course/${id}/students`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//       });
//       const data = await res.json();
//       setStudents(data.students || []);
//       setLowAttendance(data.students.filter(student => student.attendancePercentage < 75)); // Customize this percentage as needed
//     } catch (error) {
//       console.error('Error fetching students:', error);
//     }
//   };

//   useEffect(() => {
//     fetchCourseDetails();
//     fetchStudents();
//   }, [id]);

//   // Prepare data for attendance statistics chart
//   const attendanceChartData = {
//     labels: attendanceStats.map(stat => stat.date), // Dates of attendance
//     datasets: [
//       {
//         label: 'Present',
//         backgroundColor: '#4caf50', // Green for present
//         data: attendanceStats.map(stat => stat.present),
//       },
//       {
//         label: 'Absent',
//         backgroundColor: '#f44336', // Red for absent
//         data: attendanceStats.map(stat => stat.absent),
//       },
//     ],
//   };

//   // Function to navigate to the attendance page
//   const handleTakeAttendance = () => {
//     navigate(`/take-attendance/${id}`, { state: { courseName: course.name } });
//   };

//   // Function to navigate to add students page
//   const handleAddStudent = () => {
//     navigate(`/add-student/${id}`);
//   };

//   if (!course) {
//     return <div className="text-center">Loading...</div>;
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-5">
//       <h1 className="text-3xl font-bold text-center mb-8">{course.name}</h1>
      
//       {/* Course details */}
//       <div className="mb-5">
//         <h2 className="text-xl font-semibold">Course Code: {course.code}</h2>
//         <p className="text-gray-600">{course.description}</p>
//       </div>

//       {/* Attendance stats graph */}
//       <div className="mb-8">
//         <h2 className="text-lg font-semibold mb-3">Attendance Statistics</h2>
//         {attendanceStats.length > 0 ? (
//           <div className="bg-white p-4 shadow-md rounded-md">
//             <Bar data={attendanceChartData} />
//           </div>
//         ) : (
//           <p>No attendance records available.</p>
//         )}
//       </div>

//       {/* Low attendance students */}
//       <div className="mb-8">
//         <h2 className="text-lg font-semibold mb-3">Students with Low Attendance</h2>
//         {lowAttendance.length > 0 ? (
//           <table className="min-w-full border-collapse border border-gray-200">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border border-gray-300 px-4 py-2 text-left">Roll No</th>
//                 <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
//                 <th className="border border-gray-300 px-4 py-2 text-left">Attendance %</th>
//               </tr>
//             </thead>
//             <tbody>
//               {lowAttendance.map((student, index) => (
//                 <tr key={index} className="bg-white hover:bg-gray-100">
//                   <td className="border border-gray-300 px-4 py-2">{student.rollNo}</td>
//                   <td className="border border-gray-300 px-4 py-2">{student.name}</td>
//                   <td className="border border-gray-300 px-4 py-2">{student.attendancePercentage}%</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <p>All students have sufficient attendance.</p>
//         )}
//       </div>

//       {/* Calendar to mark attendance */}
//       <div className="mb-8">
//         <h2 className="text-lg font-semibold mb-3">Attendance Calendar</h2>
//         <div className="bg-white p-4 shadow-md rounded-md">
//           <Calendar 
//             tileClassName={({ date, view }) => {
//               // Add custom styles for attendance dates
//               const dateStr = date.toISOString().split('T')[0]; // Convert date to 'YYYY-MM-DD'
//               const attendanceOnDate = attendanceStats.find(stat => stat.date === dateStr);
//               return attendanceOnDate ? 'bg-green-200' : ''; // Highlight the dates with attendance
//             }}
//           />
//         </div>
//       </div>

//       {/* Student List */}
//       <div className="mb-5">
//         <h2 className="text-lg font-semibold">Student List</h2>
//         {students.length > 0 ? (
//           <table className="min-w-full border-collapse border border-gray-200">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border border-gray-300 px-4 py-2 text-left">Roll No</th>
//                 <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
//               </tr>
//             </thead>
//             <tbody>
//               {students.map((student, index) => (
//                 <tr key={index} className="bg-white hover:bg-gray-100">
//                   <td className="border border-gray-300 px-4 py-2">{student.rollno}</td>
//                   <td className="border border-gray-300 px-4 py-2">{student.name}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <p>No students found for this course.</p>
//         )}
//       </div>

//       {/* Action buttons */}
//       <div className="flex justify-between mt-8">
//         <button
//           onClick={handleTakeAttendance}
//           className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//         >
//           Take Attendance
//         </button>
//         <button
//           onClick={handleAddStudent}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Add Student Manually
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CourseDetails;

