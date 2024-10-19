//working ok ok

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [newCourse, setNewCourse] = useState({ name: '', description: '' });

  // Function to fetch courses
  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses/getcourses'); // Adjust the endpoint as necessary
      if (!res.ok) {
        throw new Error('Failed to fetch courses');
      }
      const data = await res.json();
      setCourses(data); // Assuming your API returns the list of courses directly
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Function to handle adding a new course
  // const handleAddCourse = async () => {
  //   try {
  //     const res = await fetch('/api/courses/addcourse', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(newCourse),
  //     });
  //     if (!res.ok) {
  //       throw new Error('Failed to add course');
  //     }
  //     setNewCourse({ title: '', description: '' }); // Reset the input fields
  //     fetchCourses(); // Refresh courses after adding
  //   } catch (error) {
  //     setError(error.message);
  //   }
  // };

  // Effect to fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-semibold'>Courses</h1>

     {/* Redirect Button to Add Course Page */}
        <div className='my-4'>
        <Link to="/addcourse" className='bg-green-500 text-white p-2 rounded'>
          Add New Course
        </Link>
      </div>

      
      {/* Redirect Button to Add Course Page */}
      {/* <div className='my-4'>
        <Link to="/addcourse" className='bg-green-500 text-white p-2 rounded'>
          Add New Course
        </Link>
      </div>
      Add Course Form
      <div className='my-4'>
        <h2 className='text-xl'>Add a New Course</h2>
        <input
          type='text'
          placeholder='Course Title'
          value={newCourse.title}
          onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
          className='border p-2 rounded mr-2'
        />
        <input
          type='text'
          placeholder='Course Description'
          value={newCourse.description}
          onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
          className='border p-2 rounded mr-2'
        />
        <button
          onClick={handleAddCourse}
          className='bg-blue-500 text-white p-2 rounded'
        >
          Add Course
        </button>
      </div> */}

      {/* Loading/Error/Courses Display Logic */}
      {/* {loading ? (
        <p>Loading courses...</p>
      ) : error ? (
        <p className='text-red-500'>{error}</p>
      ) : courses.length > 0 ? (
        <ul className='space-y-2'>
          {courses.map((course) => (
            <li key={course._id} className='border p-2 rounded'>
              {course.title} - {course.description} 
              <Link to={`/courses/${course._id}`} className='text-blue-600 ml-2'>
                Edit
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No courses available.</p>
      )} */}
      {/* Loading/Error/Courses Display Logic */}
      {loading ? (
        <p>Loading courses...</p>
      ) : error ? (
        <p className='text-red-500'>{error}</p>
      ) : courses.length > 0 ? (
        <ul className='space-y-2'>
          {courses.map((course) => (
            <li key={course._id} className='border p-2 rounded'>
              <Link to={`/courses/${course._id}`} className='text-blue-600'>
                {course.title} - {course.description}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No courses available.</p>
      )}
    </div>
  );
}


