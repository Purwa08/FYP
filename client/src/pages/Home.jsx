//working ok ok

// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';

// export default function Home() {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   // const [newCourse, setNewCourse] = useState({ name: '', description: '' });

//   // Function to fetch courses
//   const fetchCourses = async () => {
//     try {
//       const res = await fetch('/api/courses/getcourses'); // Adjust the endpoint as necessary
//       if (!res.ok) {
//         throw new Error('Failed to fetch courses');
//       }
//       const data = await res.json();
//       setCourses(data); // Assuming your API returns the list of courses directly
//       setLoading(false);
//     } catch (error) {
//       setError(error.message);
//       setLoading(false);
//     }
//   };

//   // Function to handle adding a new course
//   // const handleAddCourse = async () => {
//   //   try {
//   //     const res = await fetch('/api/courses/addcourse', {
//   //       method: 'POST',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //       body: JSON.stringify(newCourse),
//   //     });
//   //     if (!res.ok) {
//   //       throw new Error('Failed to add course');
//   //     }
//   //     setNewCourse({ title: '', description: '' }); // Reset the input fields
//   //     fetchCourses(); // Refresh courses after adding
//   //   } catch (error) {
//   //     setError(error.message);
//   //   }
//   // };

//   // Effect to fetch courses on component mount
//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   return (
//     <div className='p-4'>
//       <h1 className='text-2xl font-semibold'>Courses</h1>

//      {/* Redirect Button to Add Course Page */}
//         <div className='my-4'>
//         <Link to="/addcourse" className='bg-green-500 text-white p-2 rounded'>
//           Add New Course
//         </Link>
//       </div>

      
//       {/* Redirect Button to Add Course Page */}
//       {/* <div className='my-4'>
//         <Link to="/addcourse" className='bg-green-500 text-white p-2 rounded'>
//           Add New Course
//         </Link>
//       </div>
//       Add Course Form
//       <div className='my-4'>
//         <h2 className='text-xl'>Add a New Course</h2>
//         <input
//           type='text'
//           placeholder='Course Title'
//           value={newCourse.title}
//           onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
//           className='border p-2 rounded mr-2'
//         />
//         <input
//           type='text'
//           placeholder='Course Description'
//           value={newCourse.description}
//           onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
//           className='border p-2 rounded mr-2'
//         />
//         <button
//           onClick={handleAddCourse}
//           className='bg-blue-500 text-white p-2 rounded'
//         >
//           Add Course
//         </button>
//       </div> */}

//       {/* Loading/Error/Courses Display Logic */}
//       {/* {loading ? (
//         <p>Loading courses...</p>
//       ) : error ? (
//         <p className='text-red-500'>{error}</p>
//       ) : courses.length > 0 ? (
//         <ul className='space-y-2'>
//           {courses.map((course) => (
//             <li key={course._id} className='border p-2 rounded'>
//               {course.title} - {course.description} 
//               <Link to={`/courses/${course._id}`} className='text-blue-600 ml-2'>
//                 Edit
//               </Link>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No courses available.</p>
//       )} */}
//       {/* Loading/Error/Courses Display Logic */}
//       {loading ? (
//         <p>Loading courses...</p>
//       ) : error ? (
//         <p className='text-red-500'>{error}</p>
//       ) : courses.length > 0 ? (
//         <ul className='space-y-2'>
//           {courses.map((course) => (
//             <li key={course._id} className='border p-2 rounded'>
//               <Link to={`/courses/${course._id}`} className='text-blue-600'>
//                 {course.title} - {course.description}
//               </Link>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No courses available.</p>
//       )}
//     </div>
//   );
// }


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch courses when the component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses/getcourses', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // This will send cookies (access_token)
        });
        const data = await res.json();
        
        if (res.ok) {
          setCourses(data);
        } else {
          setError('Failed to load courses.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Navigate to course details page
  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  // Navigate to add course page
  const handleAddCourse = () => {
    navigate('/addcourse');
  };

  if (loading) {
    return <p className="text-center mt-8">Loading courses...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600 mt-8">{error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-[#432E54] font-bold">Your Courses</h1>
        <button
          onClick={handleAddCourse}
          className="bg-[#432E54] text-white px-4 py-2 rounded-lg hover:bg-[#3a243d]"
        >
          Add Course
        </button>
      </div>

      {courses.length === 0 ? (
        <p className="text-center">No courses found. Click Add Course to create one.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white p-4 shadow rounded-lg hover:shadow-md cursor-pointer transition"
              onClick={() => handleCourseClick(course._id)}
            >
              <h2 className="text-xl text-[#432E54] font-semibold">{course.name}</h2>
              <p className="text-lg text-[#4B4376] mt-2">{course.description}</p>
              <p className="text-sm text-[#AE445A] mt-4 italic">Course Code: {course.code}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
