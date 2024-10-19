import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function CourseDetails() {
  const { courseId } = useParams(); // Get courseId from the URL
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch course details
  const fetchCourseDetails = async () => {
    try {
      const res = await fetch(`/api/courses/${courseId}`, { credentials: 'include' });
      if (!res.ok) {
        throw new Error('Failed to fetch course details');
      }
      const data = await res.json();
      setCourse(data); // Assuming your API returns the course details directly
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Effect to fetch course details on component mount
  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  return (
    <div className='p-4'>
      {loading ? (
        <p>Loading course details...</p>
      ) : error ? (
        <p className='text-red-500'>{error}</p>
      ) : (
        <div>
          <h1 className='text-2xl font-semibold'>{course.title}</h1>
          <p>{course.description}</p>
          {/* You can also display other details like students, assignments, etc. */}
          <ul>
            {course.students?.map((student) => (
              <li key={student._id}>{student.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
