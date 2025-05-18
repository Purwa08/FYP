import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function UpdateCoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: '',
    circle: {
      latitude: '',
      longitude: '',
      radius: '',
    },
    polygon: {
      // We'll treat the polygon coordinates as a JSON string for simplicity
      coordinates: '',
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch the course details on component mount
  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await fetch(`/api/courses/course/${id}`);
        const data = await res.json();
        setCourse(data);
        // Pre-fill the form with existing course details
        setFormData({
          name: data.name,
          description: data.description,
          code: data.code,
          circle: {
            latitude: data.geofence.circle.latitude,
            longitude: data.geofence.circle.longitude,
            radius: data.geofence.circle.radius,
          },
          polygon: {
            // Convert polygon coordinates to a JSON string (if available)
            coordinates: data.geofence.polygon && data.geofence.polygon.coordinates
              ? JSON.stringify(data.geofence.polygon.coordinates)
              : '',
          },
        });
        setLoading(false);
      } catch (err) {
        setError('Error fetching course details');
        setLoading(false);
      }
    }
    fetchCourse();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle geofence nested fields (for circle and polygon)
    if (name.startsWith('circle.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        circle: {
          ...prev.circle,
          [key]: value,
        },
      }));
    } else if (name.startsWith('polygon.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        polygon: {
          ...prev.polygon,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Convert polygon coordinates string to JSON array if provided
    let polygonCoordinates;
    try {
      polygonCoordinates = formData.polygon.coordinates
        ? JSON.parse(formData.polygon.coordinates)
        : [];
    } catch (err) {
      setError('Invalid polygon coordinates JSON');
      return;
    }

    // Prepare the payload using similar structure as AddCourse page
    const payload = {
      name: formData.name,
      description: formData.description,
      code: formData.code,
      geofence: {
        circle: {
          latitude: parseFloat(formData.circle.latitude),
          longitude: parseFloat(formData.circle.longitude),
          radius: parseFloat(formData.circle.radius),
        },
        polygon: {
          coordinates: polygonCoordinates,
        },
      },
    };

    try {
      const res = await fetch(`/api/courses/update-course/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || 'Failed to update course');
      } else {
        navigate(`/course/${id}`);
      }
    } catch (err) {
      setError('Error updating course');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-700">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-3xl font-bold text-center mb-8">Update Course</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-gray-700">Course Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div>
            <label htmlFor="code" className="block text-gray-700">Course Code</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
        </div>
        <div>
          <label htmlFor="description" className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="mt-1 p-2 border border-gray-300 rounded w-full"
            rows="4"
          />
        </div>

        <h2 className="text-lg font-semibold">Geofencing Parameters</h2>
        <div>
          <h3 className="text-md font-medium">Circle</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="circle.latitude" className="block text-gray-700">Latitude</label>
              <input
                type="number"
                name="circle.latitude"
                value={formData.circle.latitude}
                onChange={handleChange}
                required
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div>
              <label htmlFor="circle.longitude" className="block text-gray-700">Longitude</label>
              <input
                type="number"
                name="circle.longitude"
                value={formData.circle.longitude}
                onChange={handleChange}
                required
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div>
              <label htmlFor="circle.radius" className="block text-gray-700">Radius (meters)</label>
              <input
                type="number"
                name="circle.radius"
                value={formData.circle.radius}
                onChange={handleChange}
                required
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-md font-medium">Polygon</h3>
          <textarea
            name="polygon.coordinates"
            value={formData.polygon.coordinates}
            onChange={handleChange}
            placeholder='Enter polygon coordinates as JSON, e.g., [[lat, lng], [lat, lng], [lat, lng]]'
            className="mt-1 p-2 border border-gray-300 rounded w-full"
            rows="4"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
        >
          Update Course
        </button>
      </form>
    </div>
  );
}
