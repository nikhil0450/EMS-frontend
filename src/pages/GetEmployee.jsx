//GetEmployee.jsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { useContext } from 'react';
import axios from 'axios';

const GetEmployee = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { backendUrl, userData, setIsLoggedIn, setUserData } = useContext(AppContext);

  // Extract the employee data from location state
  const employee = location.state?.employee;

  useEffect(() => {
    // Redirect to a fallback if no employee data is found
    if (!employee) {
      toast.error('Employee details not found.');
      navigate('/');
    }
  }, [employee, navigate]);

  if (!employee) {
    // Display a loading...
    return <div className="text-center text-lg">Loading...</div>;
  }

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

  return (
    <div className="bg-gradient-to-b from-white to-violet-200 min-h-screen flex flex-col">
      {/* Header Section */}
      <div className="sticky top-0 w-full bg-[#FFCA5C] border-b-2 border-gray-700 shadow-lg">
        <div className="flex flex-row justify-between items-center sm:px-24">
          {/* Logo */}
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
        <h2 className="text-2xl font-bold mb-6">Employee Details</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-center">
            <thead className="bg-slate-800 text-violet-300">
              <tr>
                <th className="px-4 py-2">Field</th>
                <th className="px-4 py-2">Details</th>
              </tr>
            </thead>
            <tbody className="bg-gray-100">
              <tr className="border-b">
                <td className="px-4 py-2 font-medium">Name</td>
                <td className="px-4 py-2">{employee.name}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-medium">Email</td>
                <td className="px-4 py-2">{employee.email}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-medium">Position</td>
                <td className="px-4 py-2">{employee.position}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-medium">Department</td>
                <td className="px-4 py-2">{employee.department}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-medium">Salary</td>
                <td className="px-4 py-2">{employee.salary}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">Date of Joining</td>
                <td className="px-4 py-2">
                  {new Date(employee.dateOfJoining).toLocaleDateString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GetEmployee;

