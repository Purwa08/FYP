// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';

// const CourseDetails = () => {
//   const { id } = useParams(); // Get course ID from the URL
//   const [course, setCourse] = useState(null);
//   const [attendanceStats, setAttendanceStats] = useState([]);
//   const navigate = useNavigate();

//   // Fetch course details and attendance statistics
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
//       setAttendanceStats(data.attendanceStats || []); // Assuming attendance stats are part of course data
//     } catch (error) {
//       console.error('Error fetching course details:', error);
//     }
//   };

//   useEffect(() => {
//     console.log('Fetching course details for ID:', id);
//     fetchCourseDetails();
//   }, [id]);

//   // Handle navigation to take attendance page
//   // const handleTakeAttendance = () => {
//   //   navigate(`/take-attendance/${id}`);
//   // };

//   const handleTakeAttendance = () => {
//     navigate(`/take-attendance/${id}`, { state: { courseName: course.name } });
//   };

//   // Handle navigation to add student page
//   const handleAddStudent = () => {
//     navigate(`/add-student/${id}`);
//   };

//   if (!course) {
//     return <div className="text-center">Loading...</div>; // Show loading while fetching data
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-5">
//       <h1 className="text-3xl font-bold text-center mb-8">{course.name}</h1>
//       <div className="mb-5">
//         <h2 className="text-xl font-semibold">Course Code: {course.code}</h2>
//         <p className="text-gray-600">{course.description}</p>
//       </div>

//       <div className="mb-5">
//         <h2 className="text-lg font-semibold">Geofencing Parameters</h2>
//         <p><strong>Latitude:</strong> {course.geofence.latitude}</p>
//         <p><strong>Longitude:</strong> {course.geofence.longitude}</p>
//         <p><strong>Radius:</strong> {course.geofence.radius} meters</p>
//       </div>

//       <div className="mb-5">
//         <h2 className="text-lg font-semibold">Attendance Statistics</h2>
//         {attendanceStats.length > 0 ? (
//           <ul className="list-disc list-inside">
//             {attendanceStats.map((stat, index) => (
//               <li key={index}>
//                 {stat.date}: {stat.present} Present, {stat.absent} Absent
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No attendance records available.</p>
//         )}
//       </div>

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

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
import AttendanceModal from "./AttendanceModal";

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState([]);
  const [students, setStudents] = useState([]);
  const [showStudentList, setShowStudentList] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [attendanceData, setAttendanceData] = useState({
    present: [],
    absent: [],
  });
  // const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  //const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch course details and attendance stats
  const fetchCourseDetails = async () => {
    try {
      const res = await fetch(`/api/courses/course/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      setCourse(data);
      setAttendanceStats(data.attendanceStats || []);
      //setStudents(data.students || []); // Assuming students list is part of course data
    } catch (error) {
      console.error("Error fetching course details:", error);
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  // Fetch the students under the course
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`/api/attendance/course/${id}/students`);
        const data = await response.json();
        setStudents(data.students || []);
        //setLoading(false);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, [id]);

  // Handle button navigations
  const handleTakeAttendance = () => {
    navigate(`/take-attendance/${id}`, { state: { courseName: course.name } });
  };
  const handleAddStudent = () => {
    navigate(`/add-student/${id}`);
  };

  // Chart data and options for attendance statistics
  const attendanceChartData = {
    labels: attendanceStats.map((stat) => stat.date),
    datasets: [
      {
        label: "Present",
        data: attendanceStats.map((stat) => stat.present),
        borderColor: "green",
        fill: false,
      },
      {
        label: "Absent",
        data: attendanceStats.map((stat) => stat.absent),
        borderColor: "red",
        fill: false,
      },
    ],
  };

  const attendanceChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
  };

  // Custom date coloring in calendar
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const isAttendanceDate = attendanceStats.some(
        (stat) => new Date(stat.date).toDateString() === date.toDateString()
      );
      return isAttendanceDate ? "bg-green-100" : "";
    }
    return "";
  };

  

  // const fetchAttendanceByDate = async (date) => {
  //   const token = localStorage.getItem('yourToken');
  //   // const formattedDate = date.toISOString().split('T')[0]; // Format date to 'YYYY-MM-DD' if needed
  
  //   try {
  //     const response = await fetch(
  //       `/api/attendance/course/${id}/date/${date}`,
  //       {
  //         method: "GET",
  //         headers: {
  //            Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     const data = await response.json();
  //     console.log("Attendance Data:", data); // Log the response data
  //     if (!response.ok) {
  //       throw new Error(data.message || 'Failed to fetch attendance data');
  //     }
  //     setAttendanceData(data);
  //     setSelectedDate(date);
  //     setIsModalOpen(true); // Opens the modal
  //   } catch (error) {
  //     console.error("Error fetching attendance by date:", error);
  //   }
  // };

  const formatDateToLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchAttendanceByDate = async (date) => {
    console.log('Received request for date: ',date)
    // const formattedDate = date.toISOString().split('T')[0]; // Format date to 'YYYY-MM-DD'
    const formattedDate = formatDateToLocal(date);
    console.log('Sent request for date: ',formattedDate)
    try {
      const res = await fetch(`/api/attendance/course/${id}/date/${formattedDate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Send cookies (access_token)
      });
  
      // Check if the response is a 404 or other error status
      if (!res.ok) {
        if (res.status === 404) {
          console.error('Attendance data not found for this date');
        } else {
          console.error(`Error: ${res.status} ${res.statusText}`);
        }
        throw new Error('Failed to load attendance data');
      }
  
      const data = await res.json();
      console.log('Attendance Data:', data); // Log the response data for confirmation
  
      setAttendanceData(data);
      setSelectedDate(date);
      setIsModalOpen(true); // Opens the modal
    } catch (err) {
      console.error('Error fetching attendance by date:', err.message);
    }
  };
  


  if (!course) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-5">
      <h1 className="text-4xl font-bold text-center mb-6">{course.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Course Details</h2>
          <p>
            <strong>Code:</strong> {course.code}
          </p>
          <p className="text-gray-700">{course.description}</p>

          <h3 className="text-lg font-semibold">Geofencing Parameters</h3>
          <p>
            <strong>Latitude:</strong> {course.geofence.latitude}
          </p>
          <p>
            <strong>Longitude:</strong> {course.geofence.longitude}
          </p>
          <p>
            <strong>Radius:</strong> {course.geofence.radius} meters
          </p>
        </div>

        <div className="space-y-5">
          <h2 className="text-2xl font-semibold">Attendance Statistics</h2>
          {attendanceStats.length > 0 ? (
            <Line data={attendanceChartData} options={attendanceChartOptions} />
          ) : (
            <p>No attendance data available.</p>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Calendar</h2>
        <Calendar
          tileClassName={tileClassName}
          // onClickDay={(date) => {
          //   setSelectedDate(date);
          //   fetchAttendanceByDate(date);
          // }}

          onClickDay={fetchAttendanceByDate}
        />

        <AttendanceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)} // Closes the modal
          attendanceData={attendanceData}
          date={selectedDate}
        />
      </div>

      <div className="mb-8">
        <h2
          className="text-2xl font-semibold flex items-center cursor-pointer"
          onClick={() => setShowStudentList(!showStudentList)}
        >
          Students List
          {showStudentList ? (
            <FaChevronUp className="ml-2" />
          ) : (
            <FaChevronDown className="ml-2" />
          )}
        </h2>
        {showStudentList && (
          <div className="overflow-auto max-h-80 mt-4">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2">Roll No</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Attendance (%)</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => {
                  const courseId = id; // Replace with the relevant course ID
                  const attendancePercentage =
                    student.attendancePercentage[courseId] || 0; // Default to 0 if not found

                  const isLowAttendance = attendancePercentage < 75;
                  return (
                    <tr
                      key={index}
                      className={isLowAttendance ? "bg-red-100" : ""}
                    >
                      <td className="border p-2 text-center">
                        {student.rollno}
                      </td>
                      <td className="border p-2 text-center">{student.name}</td>
                      <td className="border p-2 text-center">
                        {attendancePercentage}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
          Add Students
        </button>
      </div>
    </div>
  );
};

export default CourseDetails;
