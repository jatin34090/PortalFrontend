import React, { useState, useEffect } from 'react';

const OperatorDashboard = () => {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: '', email: '', phone: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const userDetails = JSON.parse(localStorage.getItem('user'));



  const fetchStudents = async () => {
    const token = JSON.parse(localStorage.getItem('token'));
    console.log("token", token)
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }
  
    try {
      setError('');
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/student/fetchAllStudents`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      const data = await response.json();
      setStudents(data.students);
    } catch (err) {
      setError(err.message);
    }
  };
  

  const addStudent = async (e) => {
    e.preventDefault();
    if (newStudent.phone.length !== 10) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/student/addStudent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,


        },

        body: JSON.stringify(newStudent),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add student');
      }
      const addedStudent = await response.json();
      setStudents((prevStudents) => [...prevStudents, addedStudent.student]);
      setNewStudent({ name: '', email: '', phone: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();


    // Simulating fetching user details and saving to localStorage


    const intervalId = setInterval(() => {
      fetchStudents();
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50">
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-10 p-6">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">Add Student</h2>
        {userDetails &&
          (
            <div className="bg-white shadow-md rounded-lg p-4 mb-6">
              <h2 className="text-xl font-semibold text-gray-600">User Details</h2>
              <p className="text-gray-500">
                <strong>Name:</strong> {userDetails.name}
              </p>
              <p className="text-gray-500">
                <strong>Email:</strong> {userDetails.email}
              </p>
              <p className="text-gray-500">
                <strong>Role:</strong> {userDetails.role}
              </p>
            </div>
          )
        }

        <form className="flex flex-col sm:flex-row gap-4 items-center" onSubmit={addStudent}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newStudent.name}
            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={newStudent.phone}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,10}$/.test(value)) {
                setNewStudent({ ...newStudent, phone: value });
              }
            }}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-3 text-white font-semibold rounded-lg ${isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300'
              }`}
          >
            {isLoading ? 'Adding...' : 'Add Student'}
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      <div className="mt-32 flex-1 overflow-y-auto p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Student List</h2>
        {isLoading && students.length === 0 ? (
          <p className="text-blue-500">Loading students...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="py-3 px-4 text-left">#</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Phone</th>
                  <th className="py-3 px-4 text-left">Allocated Manager</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr
                    key={index}
                    className={`border-t ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
                  >
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">{student.name}</td>
                    <td className="py-3 px-4">{student.phone || 'N/A'}</td>
                    <td className="py-3 px-4">
                      {student.allocatedMan ? student.allocatedMan : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No students found.</p>
        )}
      </div>
    </div>
  );
};

export default OperatorDashboard;
