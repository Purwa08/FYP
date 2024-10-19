import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddCourse() {
  const [newCourse, setNewCourse] = useState({ title: '', description: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Function to handle adding a new course
  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/courses/addcourse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCourse),
        // credentials: 'include', // Ensure credentials are included
      });
      if (!res.ok) {
        throw new Error('Failed to add course');
      }
      navigate('/'); // Redirect to Home after successful addition
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-semibold'>Add New Course</h1>
      <form onSubmit={handleAddCourse} className='my-4'>
        <input
          type='text'
          placeholder='Course Title'
          value={newCourse.title}
          onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
          className='border p-2 rounded mr-2'
          required
        />
        <input
          type='text'
          placeholder='Course Description'
          value={newCourse.description}
          onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
          className='border p-2 rounded mr-2'
          required
        />
        <button
          type='submit'
          className='bg-blue-500 text-white p-2 rounded'
        >
          Add Course
        </button>
      </form>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  );
}
