import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice';

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Initialize form data with current user info
  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    department: currentUser?.department || '',
    phone: currentUser?.phone || '',
    password: '', // leave password empty if not updating
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // If currentUser changes, update the formData state
  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username,
        email: currentUser.email,
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        department: currentUser.department || '',
        phone: currentUser.phone || '',
        password: '',
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <img
          src={currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <div className="flex flex-col">
    <span className="text-sm text-gray-600 mb-1">
      Username
    </span>
        <input
          type="text"
          placeholder="Username"
          id="username"
          value={formData.username}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        </div>
        <div className="flex flex-col">
    <span className="text-sm text-gray-600 mb-1">
      Email
    </span>
    </div>
        <input
          type="email"
          placeholder="Email"
          id="email"
          value={formData.email}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <div className="flex flex-col">
    <span className="text-sm text-gray-600 mb-1">
      First Name
    </span>
        <input
          type="text"
          placeholder="First Name"
          id="firstName"
          value={formData.firstName}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        </div>
        <div className="flex flex-col">
    <span className="text-sm text-gray-600 mb-1">
      Last Name
    </span>
        <input
          type="text"
          placeholder="Last Name"
          id="lastName"
          value={formData.lastName}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        </div>
        <div className="flex flex-col">
    <span className="text-sm text-gray-600 mb-1">
      Current Department: {currentUser.department || 'N/A'}
    </span>
        <input
          type="text"
          placeholder="Department"
          id="department"
          value={formData.department}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        </div>
        <div className="flex flex-col">
    <span className="text-sm text-gray-600 mb-1">
      Phone Number
    </span>
        <input
          type="text"
          placeholder="Phone"
          id="phone"
          value={formData.phone}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        </div>
        <div className="flex flex-col">
    <span className="text-sm text-gray-600 mb-1">
      Password
    </span>
        <input
          type="password"
          placeholder="Password (leave blank to keep unchanged)"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        </div>
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">
          Delete account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      {error && <p className="text-red-700 mt-5">{error}</p>}
      {updateSuccess && (
        <p className="text-green-700 mt-5">User is updated successfully!</p>
      )}
    </div>
  );
}
