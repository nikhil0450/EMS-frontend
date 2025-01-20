// components/Navbar.jsx
import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {

  const navigate = useNavigate()
  const { userData, backendUrl, setUserData, setIsLoggedIn } = useContext(AppContext)
  
  const sendVerificationOTP = async () => {
    try {
      axios.defaults.withCredentials = true

      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp')
      if (data.success) {
        navigate('/email-verify')
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message || 'Something went wrong')
    }
  }

  const logout = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/logout')
      data.success && setIsLoggedIn(false)
      data.success && setUserData(null)
      navigate('/')
    } catch (error) {
      console.error(error)
      toast.error(error.message || 'Something went wrong')
    }
  }

  const handleViewDetails = async () => {
    try {
      if (!userData || !userData.email) {
        toast.error("User email is not available.");
        console.error("User data is missing.");
        return;
      }

      const { data } = await axios.post(`${backendUrl}/api/employee/email`, {
        email: userData.email, 
      });

      if (data.success) {
        navigate('/get-employee', { state: { employee: data.data } });
      } else {
        toast.error(data.message || 'Could not fetch employee details');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Something went wrong while fetching details');
    }
  };

  return (
    <div className='w-full flex justify-between items-center px-6 sm:px-12 py-4 bg-[#FFCA5C] shadow-md absolute top-0'>

      <img src={assets.logo_1} alt="Logo" className='w-28 sm:w-32' />

      {userData ? (
        <>
          {/* Dropdown for Employee Navigation */}
          {(userData.role && userData.role === 'employee' && userData.role !== 'manager' && userData.role !== 'admin') && userData.isAccountVerified && (
            <div className="relative group ml-6">
              <button
                onClick={handleViewDetails}
                className="text-gray-800 font-semibold text-xl pt-1 cursor-pointer hover:text-[#644f85]"
              >
                Details
              </button>
            </div>
          )}

          {/* Dropdown for Admin/Manager Navigation */}
          {(userData.role && (userData.role === 'admin' || userData.role === 'manager')) && userData.isAccountVerified && (
            <div className="relative group ml-6">
              <button className="text-gray-800 font-semibold text-xl pt-1 focus:outline-none">
                Employees
              </button>
              <div className="absolute hidden group-hover:block mt-2 left-0 bg-slate-800 text-gray-200 rounded-md shadow-lg z-20">
                <ul className="list-none">
                  {userData.role === 'admin' && (
                    <li
                      onClick={() => navigate('/create-employee')}
                      className="py-2 px-4 cursor-pointer hover:bg-[#644f85] text-left whitespace-nowrap"
                    >
                      Create Employee
                    </li>
                  )}
                  <li
                    onClick={() => navigate('/get-employees')}
                    className="py-2 px-4 cursor-pointer hover:bg-[#644f85] text-left whitespace-nowrap"
                  >
                    Employees List
                  </li>
                </ul>
              </div>
            </div>
          )}
        </>
      ) : (
        <div></div>
      )}

      {/* User Dropdown or Login Button */}
      <div className='flex justify-end items-center w-full'>
        {userData ? (
          <div className='flex items-center justify-center w-10 h-10 bg-zinc-800 text-violet-300 rounded-full font-semibold text-xl relative group'>
            {userData.name[0].toUpperCase()}
            <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-zinc-900 rounded pt-10'>
              <ul className='list-none bg-slate-800 text-gray-200 p-2 m-2 text-sm rounded-md'>
                {!userData.isAccountVerified && (
                  <li onClick={sendVerificationOTP} className='py-1 px-4 cursor-pointer hover:bg-[#644f85] text-left whitespace-nowrap'>
                    Verify Account
                  </li>
                )}
                <li onClick={logout} className='py-1 px-4 cursor-pointer hover:bg-[#644f85] text-left whitespace-nowrap'>
                  Logout
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <button onClick={() => navigate('/login')} className='flex items-center gap-3 text-gray-100 bg-slate-800 hover:bg-[#493a62] duration-300 font-bold px-6 py-3'>
            Sign Up/Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar
