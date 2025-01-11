// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';

// const TakeAttendance = () => {
//   const { id } = useParams();
//   console.log("course id is: ", id);
//   const [students, setStudents] = useState([]);
//   const [attendanceWindowOpen, setAttendanceWindowOpen] = useState(false);
//   const [attendanceData, setAttendanceData] = useState({});
//   const [loading, setLoading] = useState(true);

//   // Fetch the students under the course
//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const response = await fetch(`/api/attendance/course/${id}/students`);
//         const data = await response.json();
//         setStudents(data.students || []);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching students:", error);
//       }
//     };
//     fetchStudents();
//   }, [id]);

//   // Handle attendance marking
//   const handleAttendanceChange = (studentId, status) => {
//     setAttendanceData({
//       ...attendanceData,
//       [studentId]: status,
//     });
//   };

//   // Start or close attendance window
//   const handleAttendanceWindow = async () => {
//     try {
//       const endpoint = attendanceWindowOpen ? 'close-attendance' : 'start-attendance';
//       const response = await fetch(`/api/attendance/course/${id}/${endpoint}`, {
//         method: 'POST',
//       });
//       if (response.ok) {
//         setAttendanceWindowOpen(!attendanceWindowOpen);
//       } else {
//         console.error("Error toggling attendance window:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Error toggling attendance window:", error);
//     }
//   };

//   // Submit attendance data
//   const submitAttendance = async () => {
//     const attendancePayload = Object.keys(attendanceData).map(studentId => ({
//       studentId,
//       status: attendanceData[studentId],
//     }));

//     try {
//       const response = await fetch(`/api/attendance/course/${id}/mark-attendance`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ students: attendancePayload }),
//       });

//       if (response.ok) {
//         alert("Attendance submitted successfully!");
//       } else {
//         console.error("Error submitting attendance:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Error submitting attendance:", error);
//     }
//   };

//   if (loading) {
//     return <div className="text-center">Loading students...</div>;
//   }

//   return (
//     <div className="container mx-auto p-8">
//       <h1 className="text-2xl font-bold text-center mb-6">Take Attendance</h1>

//       <div className="flex justify-between items-center mb-6">
//         <button
//           onClick={handleAttendanceWindow}
//           className={`px-4 py-2 text-white rounded ${attendanceWindowOpen ? 'bg-red-500' : 'bg-green-500'}`}>
//           {attendanceWindowOpen ? 'Close Attendance Window' : 'Start Attendance Window'}
//         </button>
//         <span>{new Date().toDateString()}</span>
//       </div>

//       <div className="bg-white shadow-md rounded-lg p-6">
//         <h2 className="text-xl font-semibold mb-4">Students List</h2>
//         <table className="min-w-full bg-white">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="py-2 px-4 border text-left">Student Name</th>
//               <th className="py-2 px-4 border text-left">Roll No</th>
//               <th className="py-2 px-4 border text-left">Attendance</th>
//             </tr>
//           </thead>
//           <tbody>
//             {students.length === 0 ? (
//               <tr>
//                 <td colSpan="3" className="text-center py-2">No students registered for this course yet.</td>
//               </tr>
//             ) : (
//               students.map(student => (
//                 <tr key={student._id} className="border-b">
//                   <td className="py-2 px-4">{student.name}</td>
//                   <td className="py-2 px-4">{student.rollno}</td>
//                   <td className="py-2 px-4">
//                     <div className="flex space-x-2">
//                       <label>
//                         <input
//                           type="radio"
//                           name={student._id}
//                           onChange={() => handleAttendanceChange(student._id, 'present')}
//                           disabled={!attendanceWindowOpen}
//                           className="mr-1"
//                         />
//                         Present
//                       </label>
//                       <label>
//                         <input
//                           type="radio"
//                           name={student._id}
//                           onChange={() => handleAttendanceChange(student._id, 'absent')}
//                           disabled={!attendanceWindowOpen}
//                           className="mr-1"
//                         />
//                         Absent
//                       </label>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       <button
//         onClick={submitAttendance}
//         disabled={!attendanceWindowOpen}
//         className="mt-6 w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600">
//         Submit Attendance
//       </button>
//     </div>
//   );
// };

// export default TakeAttendance;


import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaSyncAlt, FaPlay, FaStop } from "react-icons/fa";

const TakeAttendance = () => {
  const { id } = useParams(); // Course ID from the URL
  const [markedStudents, setMarkedStudents] = useState([]); // List of students who marked attendance
  const [pendingStudents, setPendingStudents] = useState([]); // List of students yet to mark attendance
  const [attendanceWindowOpen, setAttendanceWindowOpen] = useState(false); // Attendance window status
  const [loading, setLoading] = useState(true); // Loading state
  const [courseName, setCourseName] = useState(""); // Course name

  // Fetch real-time attendance status
  const fetchAttendanceStatus = async () => {
    try {
      const response = await fetch(`/api/attendance/course/${id}/real-time-status`);
      if (!response.ok) {
        throw new Error("Failed to fetch attendance status");
      }

      const data = await response.json();
      console.log("Attendance Status:", data);

      setMarkedStudents(data.markedStudents || []);
      setPendingStudents(data.pendingStudents || []);
      //setAttendanceWindowOpen(data.isWindowOpen); // Update the attendance window status

      // Set course name (if part of the response)
      if (data.courseName) {
        setCourseName(data.courseName);
      }
    } catch (error) {
      console.error("Error fetching attendance status:", error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle attendance window
  const handleAttendanceWindow = async () => {
    try {
      const endpoint = attendanceWindowOpen ? "close-attendance" : "start-attendance";
      const response = await fetch(`/api/attendance/course/${id}/${endpoint}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to toggle attendance window");
      }

      setAttendanceWindowOpen(!attendanceWindowOpen); // Toggle the window status
    } catch (error) {
      console.error("Error toggling attendance window:", error);
    }
  };

  // Fetch attendance status when the component mounts
  useEffect(() => {
    fetchAttendanceStatus();
  }, [id]);

  if (loading) {
    return <div className="text-center">Loading attendance data...</div>;
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      {/* Top Section: Course Name and Date */}
      <div className="bg-blue-100 shadow-md rounded-lg p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-800">{courseName}</h1>
          <p className="text-gray-600">{new Date().toDateString()}</p>
        </div>
      </div>

      {/* Buttons: Start/Close and Refresh */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleAttendanceWindow}
          className={`flex items-center px-4 py-2 text-white font-semibold rounded ${
            attendanceWindowOpen ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {attendanceWindowOpen ? (
            <>
              <FaStop className="mr-2" />
              Close Attendance Window
            </>
          ) : (
            <>
              <FaPlay className="mr-2" />
              Start Attendance Window
            </>
          )}
        </button>
        <button
          onClick={fetchAttendanceStatus}
          className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded"
        >
          <FaSyncAlt className="mr-2" />
          Refresh Status
        </button>
      </div>

      {/* Marked and Pending Students */}
      <div className="grid grid-cols-2 gap-6">
        {/* Marked Students */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-green-600">Marked Attendance</h2>
          {markedStudents.length === 0 ? (
            <p className="text-gray-500">No students have marked attendance yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {markedStudents.map((student) => (
                <li key={student._id} className="py-2 flex justify-between">
                  <span className="font-medium">{student.name}</span>
                  <span className="text-gray-500">Roll No: {student.rollno}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pending Students */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-red-600">Pending Attendance</h2>
          {pendingStudents.length === 0 ? (
            <p className="text-gray-500"></p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {pendingStudents.map((student) => (
                <li key={student._id} className="py-2 flex justify-between">
                  <span className="font-medium">{student.name}</span>
                  <span className="text-gray-500">Roll No: {student.rollno}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TakeAttendance;
