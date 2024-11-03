import React from "react";

const AttendanceModal = ({ isOpen, onClose, attendanceData, date }) =>
  isOpen ? (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-semibold mb-4">
          Attendance for {date.toDateString()}
        </h2>
        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          <h3 className="text-lg font-semibold">Present</h3>
          <ul className="list-disc pl-5">
            {attendanceData.present.map((student) => (
              <li key={student._id}>
                {student.name} ({student.rollno})
              </li>
            ))}
          </ul>
          <h3 className="text-lg font-semibold mt-4">Absent</h3>
          <ul className="list-disc pl-5">
            {attendanceData.absent.map((student) => (
              <li key={student._id}>
                {student.name} ({student.rollno})
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  ) : null;

export default AttendanceModal;
