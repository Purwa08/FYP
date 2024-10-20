// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';

// export default function CourseDetails() {
//   const { courseId } = useParams(); // Get courseId from the URL
//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Function to fetch course details
//   const fetchCourseDetails = async () => {
//     try {
//       const res = await fetch(`/api/courses/${courseId}`, { credentials: 'include' });
//       if (!res.ok) {
//         throw new Error('Failed to fetch course details');
//       }
//       const data = await res.json();
//       setCourse(data); // Assuming your API returns the course details directly
//       setLoading(false);
//     } catch (error) {
//       setError(error.message);
//       setLoading(false);
//     }
//   };

//   // Effect to fetch course details on component mount
//   useEffect(() => {
//     fetchCourseDetails();
//   }, [courseId]);

//   return (
//     <div className='p-4'>
//       {loading ? (
//         <p>Loading course details...</p>
//       ) : error ? (
//         <p className='text-red-500'>{error}</p>
//       ) : (
//         <div>
//           <h1 className='text-2xl font-semibold'>{course.title}</h1>
//           <p>{course.description}</p>
//           {/* You can also display other details like students, assignments, etc. */}
//           <ul>
//             {course.students?.map((student) => (
//               <li key={student._id}>{student.name}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }



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
        // headers: {
        //   'Authorization': `Bearer ${localStorage.getItem('token')}`, // Ensure you have the token saved
        // },
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
// import { useParams } from 'react-router-dom';
// import axios from 'axios';

// const CourseDetails = () => {
//   const params = useParams();
//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchCourseDetails = async () => {
//       try {
//         const response = await axios.get(`/api/courses/course/${params.id}`);
//         setCourse(response.data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourseDetails();
//   }, [params.id]);

//   // Check if the course data is still loading
//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   // Check for errors
//   if (error) {
//     return <div>{error}</div>;
//   }

//   // Check if the course was not found
//   if (!course) {
//     return <div>No course found.</div>;
//   }

//   // Check if geofence details are available
//   const { geofence } = course;
//   if (!geofence) {
//     return <div>Geofence details are not available.</div>;
//   }

//   return (
//     <div>
//       <h1>{course.name}</h1>
//       <p>Description: {course.description}</p>
//       <p>Code: {course.code}</p>

//       {/* Geofence Details */}
//       <h2>Geofence Details</h2>
//       <p>Latitude: {geofence.latitude !== undefined ? geofence.latitude : 'N/A'}</p>
//       <p>Longitude: {geofence.longitude !== undefined ? geofence.longitude : 'N/A'}</p>
//       <p>Radius: {geofence.radius !== undefined ? geofence.radius : 'N/A'} meters</p>

//       {/* Attendance Statistics Section */}
//       <h2>Attendance Statistics</h2>
//       {/* You can add logic here to display attendance statistics */}

//       {/* Action Buttons */}
//       <button onClick={() => {/* Navigate to attendance page */}}>
//         Take Attendance
//       </button>
//       <button onClick={() => {/* Navigate to add student page */}}>
//         Add Student Manually
//       </button>
//     </div>
//   );
// };

// export default CourseDetails;
