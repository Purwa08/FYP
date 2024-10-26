// import React, { useState } from 'react';
// import { useNavigate ,useParams} from 'react-router-dom';

// const AddStudent = () => {
//     const { id } = useParams();
//   const [studentDetails, setStudentDetails] = useState({
//     name: '',
//     email: '',
//     rollno: '', 
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setStudentDetails((prevDetails) => ({
//       ...prevDetails,
//       [name]: value,
//     }));
//   };

  

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     const newStudent = {
//       ...studentDetails,
      
//     };

//     try {
//       const response = await fetch(`/api/courses/course/${id}/add-student`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newStudent),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'An error occurred while adding the student.');
//       }

//       const data = await response.json();
//       alert(`Student added successfully! Password: ${data.student.password}`);
//       navigate(`/course/${id}`); // Navigate back to course details after adding
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="w-full max-w-md">
//         <h2 className="text-2xl font-bold text-center mb-6">Add Student</h2>
//         {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
//         <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 py-6">
//           <div className="mb-4">
//             <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
//             <input
//               type="text"
//               name="name"
//               id="name"
//               required
//               value={studentDetails.name}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
//               placeholder="Enter student name"
//             />
//           </div>
//           <div className="mb-4">
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
//             <input
//               type="email"
//               name="email"
//               id="email"
//               required
//               value={studentDetails.email}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
//               placeholder="Enter student email"
//             />
//           </div>
//           <div className="mb-4">
//             <label htmlFor="rollno" className="block text-sm font-medium text-gray-700">Roll Number</label>
//             <input
//               type="text"
//               name="rollno" // Use rollno here
//               id="rollno"
//               required
//               value={studentDetails.rollno} // Update to rollno
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
//               placeholder="Enter roll number"
//             />
//           </div>
//           <div className="mb-6">
//             <button
//               type="submit"
//               className={`w-full px-4 py-2 text-white font-semibold rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
//               disabled={loading}
//             >
//               {loading ? 'Adding...' : 'Add Student'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddStudent;




import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const AddStudent = () => {
  const { id } = useParams();
  const [studentDetails, setStudentDetails] = useState({
    name: '',
    email: '',
    rollno: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  // Handle form input changes for adding a single student
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Submit form to add a single student
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/courses/course/${id}/add-student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentDetails),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error adding student.');
      }

      const data = await response.json();
      alert(`Student added successfully! Password: ${data.student.password}`);
      navigate(`/course/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload for Excel import
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      setError('Please select an Excel file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await fetch(`/api/courses/course/${id}/import-students`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error uploading file.');
      }

      //const data = await response.json();
      alert(`File uploaded successfully!`);
      navigate(`/course/${id}`);
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
              name="rollno"
              id="rollno"
              required
              value={studentDetails.rollno}
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

        {/* Divider */}
        <hr className="my-6" />

        <h2 className="text-xl font-bold text-center mb-4">Or Import Students from Excel</h2>
        <p className="text-sm text-gray-500 mb-4">
          Upload an Excel file with columns <strong>Name</strong>, <strong>Email</strong>, and <strong>RollNo</strong>.
        </p>

        <div className="bg-white shadow-md rounded px-8 py-6">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="mb-4 w-full px-4 py-2 border border-gray-300 rounded-md"
          />

          <button
            onClick={handleFileUpload}
            className={`w-full px-4 py-2 text-white font-semibold rounded-md ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload Excel File'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;
