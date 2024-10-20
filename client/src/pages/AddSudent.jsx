// import React, { useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';

// const AddStudentPage = () => {
//   const params = useParams(); // Get courseId from the route params
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [rollno, setRollNumber] = useState('');
//   const [loading, setLoading] = useState(false); // Handle loading state
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       // Make a POST request to the backend to add the student
//       const response = await axios.post(`/api/course/${params.id}/add-student`, {
//         name,
//         email,
//         rollno,
//       });

//       if (response.status === 201) {
//         setSuccess('Student added successfully!');
//         setName('');
//         setEmail('');
//         setRollNumber('');
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
//         <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Add Student to Course</h1>
        
//         {error && <p className="text-red-500 mb-4">{error}</p>}
//         {success && <p className="text-green-500 mb-4">{success}</p>}
        
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Name Input */}
//           <div>
//             <label htmlFor="name" className="block text-sm font-medium text-gray-700">Student Name</label>
//             <input
//               type="text"
//               id="name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//               className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter student name"
//             />
//           </div>

//           {/* Email Input */}
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700">Student Email</label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter student email"
//             />
//           </div>

//           {/* Roll Number Input */}
//           <div>
//             <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700">Roll Number</label>
//             <input
//               type="text"
//               id="rollNumber"
//               value={rollno}
//               onChange={(e) => setRollNumber(e.target.value)}
//               required
//               className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter student roll number"
//             />
//           </div>

//           {/* Submit Button */}
//           <div>
//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ${
//                 loading ? 'cursor-not-allowed bg-blue-300' : ''
//               }`}
//             >
//               {loading ? 'Adding Student...' : 'Add Student'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddStudentPage;





// import React, { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const AddStudent = () => {
//   const { id } = useParams(); // Get course ID from URL parameters
//   const navigate = useNavigate();
//   const [studentDetails, setStudentDetails] = useState({
//     name: '',
//     email: '',
//     rollno: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setStudentDetails((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const response = await axios.post(`/api/courses/course/${id}/add-student`, studentDetails);
//       alert(`Student added successfully! Password: ${response.data.password}`);
//       navigate(`/course/${id}`); // Navigate back to course details after adding
//     } catch (err) {
//       setError(err.response?.data?.message || 'An error occurred while adding the student.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
//       <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
//         <h2 className="text-2xl font-semibold text-center text-gray-700">Add Student to Course</h2>
//         {error && <p className="mt-2 text-red-500">{error}</p>}
//         <form onSubmit={handleSubmit} className="mt-4">
//           <div className="mb-4">
//             <label className="block text-gray-600" htmlFor="name">Name</label>
//             <input
//               type="text"
//               name="name"
//               id="name"
//               required
//               value={studentDetails.name}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-600" htmlFor="email">Email</label>
//             <input
//               type="email"
//               name="email"
//               id="email"
//               required
//               value={studentDetails.email}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-600" htmlFor="rollNumber">Roll Number</label>
//             <input
//               type="text"
//               name="rollNumber"
//               id="rollNumber"
//               required
//               value={studentDetails.rollno}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
//             />
//           </div>
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full px-4 py-2 font-semibold text-white rounded-md ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none`}
//           >
//             {loading ? 'Adding Student...' : 'Add Student'}
//           </button>
//         </form>
//         <button
//           onClick={() => navigate(-1)}
//           className="mt-4 text-sm text-blue-600 hover:underline"
//         >
//           Back
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AddStudent;




import React, { useState } from 'react';
import { useNavigate ,useParams} from 'react-router-dom';

const AddStudent = () => {
    const { id } = useParams();
  const [studentDetails, setStudentDetails] = useState({
    name: '',
    email: '',
    rollno: '', // Change to rollno
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-8); // Generates a random password
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const newStudent = {
      ...studentDetails,
      password: generateRandomPassword(), // Generate a random password
    };

    try {
      const response = await fetch(`/api/courses/course/${id}/add-student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStudent),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An error occurred while adding the student.');
      }

      const data = await response.json();
      alert(`Student added successfully! Password: ${data.student.password}`);
      navigate(`/course/${id}`); // Navigate back to course details after adding
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Add Student</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 py-6">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              required
              value={studentDetails.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter student name"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              required
              value={studentDetails.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter student email"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="rollno" className="block text-sm font-medium text-gray-700">Roll Number</label>
            <input
              type="text"
              name="rollno" // Use rollno here
              id="rollno"
              required
              value={studentDetails.rollno} // Update to rollno
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter roll number"
            />
          </div>
          <div className="mb-6">
            <button
              type="submit"
              className={`w-full px-4 py-2 text-white font-semibold rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;
