// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// export default function AddCourse() {
//   const [newCourse, setNewCourse] = useState({ title: '', description: '' });
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   // Function to handle adding a new course
//   const handleAddCourse = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch('/api/courses/addcourse', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newCourse),
//         // credentials: 'include', // Ensure credentials are included
//       });
//       if (!res.ok) {
//         throw new Error('Failed to add course');
//       }
//       navigate('/'); // Redirect to Home after successful addition
//     } catch (error) {
//       setError(error.message);
//     }
//   };

//   return (
//     <div className='p-4'>
//       <h1 className='text-2xl font-semibold'>Add New Course</h1>
//       <form onSubmit={handleAddCourse} className='my-4'>
//         <input
//           type='text'
//           placeholder='Course Title'
//           value={newCourse.title}
//           onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
//           className='border p-2 rounded mr-2'
//           required
//         />
//         <input
//           type='text'
//           placeholder='Course Description'
//           value={newCourse.description}
//           onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
//           className='border p-2 rounded mr-2'
//           required
//         />
//         <button
//           type='submit'
//           className='bg-blue-500 text-white p-2 rounded'
//         >
//           Add Course
//         </button>
//       </form>
//       {error && <p className='text-red-500'>{error}</p>}
//     </div>
//   );
// }








// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const AddCourse = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     code: '',
//     latitude: '',
//     longitude: '',
//     radius: '',
//   });
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.id]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch('/api/courses/addcourse', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       if (res.ok) {
//         const data = await res.json();
//         console.log('Course added:', data);
//         navigate('/'); // Redirect to home after successful addition
//       } else {
//         const errorData = await res.json();
//         console.error('Error adding course:', errorData.message);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-5">
//       <h1 className="text-3xl font-bold text-center mb-8">Add New Course</h1>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label htmlFor="name" className="block text-gray-700">Course Name</label>
//             <input
//               type="text"
//               id="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               className="mt-1 p-2 border border-gray-300 rounded w-full"
//             />
//           </div>
//           <div>
//             <label htmlFor="code" className="block text-gray-700">Course Code</label>
//             <input
//               type="text"
//               id="code"
//               value={formData.code}
//               onChange={handleChange}
//               required
//               className="mt-1 p-2 border border-gray-300 rounded w-full"
//             />
//           </div>
//         </div>
//         <div>
//           <label htmlFor="description" className="block text-gray-700">Description</label>
//           <textarea
//             id="description"
//             value={formData.description}
//             onChange={handleChange}
//             required
//             className="mt-1 p-2 border border-gray-300 rounded w-full"
//             rows="4"
//           />
//         </div>

//         <h2 className="text-lg font-semibold">Geofencing Parameters</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div>
//             <label htmlFor="latitude" className="block text-gray-700">Latitude</label>
//             <input
//               type="number"
//               id="latitude"
//               value={formData.latitude}
//               onChange={handleChange}
//               required
//               className="mt-1 p-2 border border-gray-300 rounded w-full"
//             />
//           </div>
//           <div>
//             <label htmlFor="longitude" className="block text-gray-700">Longitude</label>
//             <input
//               type="number"
//               id="longitude"
//               value={formData.longitude}
//               onChange={handleChange}
//               required
//               className="mt-1 p-2 border border-gray-300 rounded w-full"
//             />
//           </div>
//           <div>
//             <label htmlFor="radius" className="block text-gray-700">Radius (meters)</label>
//             <input
//               type="number"
//               id="radius"
//               value={formData.radius}
//               onChange={handleChange}
//               required
//               className="mt-1 p-2 border border-gray-300 rounded w-full"
//             />
//           </div>
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
//         >
//           Add Course
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddCourse;



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddCourse = () => {
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
      coordinates: [
        { latitude: '', longitude: '' },
        { latitude: '', longitude: '' },
        { latitude: '', longitude: '' },
        { latitude: '', longitude: '' },
      ],
    },
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value, dataset } = e.target;
    if (dataset.type === 'circle') {
      setFormData((prev) => ({
        ...prev,
        circle: { ...prev.circle, [id]: value },
      }));
    } else if (dataset.type === 'polygon') {
      const index = Number(dataset.index);
      const updatedCoordinates = [...formData.polygon.coordinates];
      updatedCoordinates[index][id] = value;
      setFormData((prev) => ({
        ...prev,
        polygon: { ...prev.polygon, coordinates: updatedCoordinates },
      }));
    } else {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare data for submission
      const payload = {
        ...formData,
        circle: {
          latitude: parseFloat(formData.circle.latitude),
          longitude: parseFloat(formData.circle.longitude),
          radius: parseFloat(formData.circle.radius),
        },
        polygon: {
          coordinates: formData.polygon.coordinates.map((coord) => [
            parseFloat(coord.latitude),
            parseFloat(coord.longitude),
          ]),
        },
      };

      const res = await fetch('/api/courses/addcourse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        console.log('Course added:', data);
        navigate('/'); // Redirect to home after successful addition
      } else {
        const errorData = await res.json();
        console.error('Error adding course:', errorData.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-3xl font-bold text-center mb-8">Add New Course</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-gray-700">Course Name</label>
            <input
              type="text"
              id="name"
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
              id="code"
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
            id="description"
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
              <label htmlFor="latitude" className="block text-gray-700">Latitude</label>
              <input
                type="number"
                id="latitude"
                value={formData.circle.latitude}
                onChange={handleChange}
                data-type="circle"
                required
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div>
              <label htmlFor="longitude" className="block text-gray-700">Longitude</label>
              <input
                type="number"
                id="longitude"
                value={formData.circle.longitude}
                onChange={handleChange}
                data-type="circle"
                required
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div>
              <label htmlFor="radius" className="block text-gray-700">Radius (meters)</label>
              <input
                type="number"
                id="radius"
                value={formData.circle.radius}
                onChange={handleChange}
                data-type="circle"
                required
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-md font-medium">Polygon</h3>
          <div className="space-y-4">
            {formData.polygon.coordinates.map((coordinate, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="latitude" className="block text-gray-700">Latitude</label>
                  <input
                    type="number"
                    id="latitude"
                    value={coordinate.latitude}
                    onChange={handleChange}
                    data-type="polygon"
                    data-index={index}
                    required
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div>
                  <label htmlFor="longitude" className="block text-gray-700">Longitude</label>
                  <input
                    type="number"
                    id="longitude"
                    value={coordinate.longitude}
                    onChange={handleChange}
                    data-type="polygon"
                    data-index={index}
                    required
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
        >
          Add Course
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
