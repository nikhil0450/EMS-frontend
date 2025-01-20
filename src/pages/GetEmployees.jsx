//pages/GetEmployees.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import { useContext } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const GetEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const { backendUrl, userData, setIsLoggedIn, setUserData } = useContext(AppContext);
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/employee/get-employees`);
      if (response.data.success) {
        setEmployees(response.data.data || []);
      } else {
        toast.error(response.data.message || 'Failed to fetch employees');
      }
    } catch (error) {
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      data.success && setIsLoggedIn(false);
      data.success && setUserData(null);
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Something went wrong');
    }
  };

  const updateEmployee = async (updatedEmployee) => {
    try {
      const response = await axios.put(`${backendUrl}/api/employee/${updatedEmployee._id}`, updatedEmployee);
      if (response.data.success) {
        toast.success('Employee updated successfully');
        fetchEmployees();
        setIsModalOpen(false);
      } else {
        toast.error(response.data.message || 'Failed to update employee');
      }
    } catch (error) {
      toast.error('Failed to update employee');
    }
  };

  const deleteEmployee = async (employeeId) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/employee/${employeeId}`);
      if (response.data.success) {
        toast.success('Employee deleted successfully');
        fetchEmployees();
        setIsDeleteModalOpen(false);
      } else {
        toast.error(response.data.message || 'Failed to delete employee');
      }
    } catch (error) {
      toast.error('Failed to delete employee');
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    updateEmployee(selectedEmployee);
  };

  const handleDelete = (employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (employeeToDelete) {
      deleteEmployee(employeeToDelete._id);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setEmployeeToDelete(null);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1); // Reset to the first page when rows per page changes
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const totalPages = Math.ceil(employees.length / rowsPerPage);
  const paginatedEmployees = employees.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="bg-gradient-to-b from-white to-violet-200 min-h-screen flex flex-col">
      {/* Header Section */}
      <div className="sticky top-0 w-full bg-[#FFCA5C] border-b-2 border-gray-700 shadow-lg">
        <div className="flex flex-row justify-between items-center sm:px-24">
          <img
            onClick={() => navigate('/')}
            src={assets.logo_1}
            alt="Logo"
            className="w-28 sm:w-32 cursor-pointer"
          />
          <div className="flex items-center justify-center w-9 h-9 bg-zinc-800 text-violet-300 rounded-full font-semibold text-xl relative group">
            {userData && userData.name[0].toUpperCase()}
            <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-zinc-900 rounded pt-10">
              <ul className="list-none bg-slate-800 text-gray-200 p-2 m-2 text-sm rounded-md">
                <li
                  onClick={logout}
                  className="py-1 px-4 cursor-pointer hover:bg-[#644f85] text-left whitespace-nowrap"
                >
                  Logout
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col w-full text-lg font-semibold text-center px-6 sm:px-24 mt-6">
        <h2 className="text-2xl font-bold mb-6">List of Employees</h2>

        {loading ? (
          <div className="text-center text-slate-800">Loading...</div>
        ) : (
          <div className="overflow-x-auto max-w-full">
            <table className="min-w-full table-auto text-center">
              <thead className="bg-slate-800 text-violet-300">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Position</th>
                  <th className="px-4 py-2">Department</th>
                  <th className="px-4 py-2">Salary</th>
                  <th className="px-4 py-2">Date of Joining</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.map((employee) => (
                  <tr key={employee._id} className="border-b bg-gray-100">
                    <td className="px-4 py-2">{employee.name}</td>
                    <td className="px-4 py-2">{employee.email}</td>
                    <td className="px-4 py-2">{employee.position}</td>
                    <td className="px-4 py-2">{employee.department}</td>
                    <td className="px-4 py-2">{employee.salary}</td>
                    <td className="px-4 py-2">
                      {new Date(employee.dateOfJoining).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        className="bg-[#FFCA5C] text-gray-800 px-3 py-1 rounded-lg hover:bg-[#ebad2d]"
                        onClick={() => handleEdit(employee)}
                      >
                        Edit
                      </button>
                      {userData && userData.role === 'admin' && (
                      <button
                        className="bg-[#FF654F] text-white px-3 py-1 ml-2 rounded-lg hover:bg-[#eb452d]"
                        onClick={() => handleDelete(employee)}
                      >
                        Delete
                      </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <div>
                Rows per page:
                <select
                  value={rowsPerPage}
                  onChange={handleRowsPerPageChange}
                  className="ml-2 p-2 rounded-md border bg-slate-800 text-slate-100"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
              <div>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-800 text-slate-100 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="mx-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-800 text-slate-100 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Editing Employee */}
      {isModalOpen && selectedEmployee && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-slate-800 p-6 rounded-lg shadow-lg w-[90%] sm:w-[30rem]">
            <h3 className="flex justify-center text-xl font-semibold text-violet-300 mb-4">Edit Employee</h3>
            <form onSubmit={handleUpdateSubmit}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <label htmlFor="name" className="text-yellow-300 font-medium mb-2">Name</label>
                  <input
                    id="name"
                    type="text"
                    value={selectedEmployee.name}
                    onChange={(e) =>
                      setSelectedEmployee({ ...selectedEmployee, name: e.target.value })
                    }
                    placeholder="Name"
                    className="text-gray-300 bg-[#493a62] rounded-lg px-3 py-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="email" className="text-yellow-300 font-medium mb-2">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={selectedEmployee.email}
                    onChange={(e) =>
                      setSelectedEmployee({ ...selectedEmployee, email: e.target.value })
                    }
                    placeholder="Email"
                    className="text-gray-300 bg-[#493a62] rounded-lg px-3 py-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="position" className="text-yellow-300 font-medium mb-2">Position</label>
                  <input
                    id="position"
                    type="text"
                    value={selectedEmployee.position}
                    onChange={(e) =>
                      setSelectedEmployee({ ...selectedEmployee, position: e.target.value })
                    }
                    placeholder="Position"
                    className="text-gray-300 bg-[#493a62] rounded-lg px-3 py-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="department" className="text-yellow-300 font-medium mb-2">Department</label>
                  <input
                    id="department"
                    type="text"
                    value={selectedEmployee.department}
                    onChange={(e) =>
                      setSelectedEmployee({ ...selectedEmployee, department: e.target.value })
                    }
                    placeholder="Department"
                    className="text-gray-300 bg-[#493a62] rounded-lg px-3 py-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="salary" className="text-yellow-300 font-medium mb-2">Salary</label>
                  <input
                    id="salary"
                    type="number"
                    value={selectedEmployee.salary}
                    onChange={(e) =>
                      setSelectedEmployee({ ...selectedEmployee, salary: e.target.value })
                    }
                    placeholder="Salary"
                    className="text-gray-300 bg-[#493a62] rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  className="bg-gray-300 px-4 py-2 rounded-lg"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-yellow-400 px-4 py-2 rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && employeeToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-slate-800 p-6 rounded-lg shadow-lg w-[90%] sm:w-[30rem]">
            <h3 className="text-xl font-semibold text-yellow-300 text-center mb-4">Are you sure you want to delete this employee?</h3>
            <div className="flex justify-center">
              <button
                className="bg-gray-300 px-4 py-2 mr-2 rounded-lg"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetEmployees;

