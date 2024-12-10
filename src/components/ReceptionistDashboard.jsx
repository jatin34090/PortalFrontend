import React, { useState, useEffect } from 'react';

const ReceptionistDashboard = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const manList = ["abc", "bca"];

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/student/fetchAllStudents');
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      const data = await response.json();
      setStudents(data.students);
    } catch (err) {
      setError(err.message);
    }
  };

  const allocateManToStudent = async (studentId, allocatedMan) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/student/editAllocatedMan/${studentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ allocatedMan }),
      });

      if (!response.ok) {
        throw new Error('Failed to allocate man');
      }

      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === studentId ? { ...student, allocatedMan } : student
        )
      );

      
      await fetchStudents();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(); 
    const interval = setInterval(fetchStudents, 3000); 

    return () => clearInterval(interval); 
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">
        Receptionist Dashboard
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">
          Student List
        </h2>

        {error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 border border-gray-300">
              <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
                <tr>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Phone</th>
                  <th className="px-4 py-2 border">Allocated Man</th>
                  <th className="px-4 py-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="bg-white border-b hover:bg-gray-100">
                    <td className="px-4 py-2 border">{student.name}</td>
                    <td className="px-4 py-2 border">{student.phone || 'N/A'}</td>
                    <td className="px-4 py-2 border">
                      {student.allocatedMan || 'Not allocated'}
                    </td>
                    <td className="px-4 py-2 border">
                      <select
                        className="border rounded px-2 py-1 w-full"
                        value={student.allocatedMan || ''}
                        onChange={(e) => allocateManToStudent(student._id, e.target.value)}
                      >
                        <option value="">Select a staff</option>
                        {manList.map((man, index) => (
                          <option key={index} value={man}>
                            {man}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500">No students found.</p>
        )}
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
