//pages/Login.jsx
import React, { useState, useContext } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee'); // Default to employee
  const [specialCode, setSpecialCode] = useState('');
  const [isAdminCodeValid, setIsAdminCodeValid] = useState(false);
  const [isManagerCodeValid, setIsManagerCodeValid] = useState(false);

  const validateCode = (code) => {
    const adminCode = 'admin123';
    const managerCode = 'manager123';

    setIsAdminCodeValid(false);
    setIsManagerCodeValid(false);

    if (code === adminCode) {
      setIsAdminCodeValid(true);
    } else if (code === managerCode) {
      setIsManagerCodeValid(true);
    }
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      axios.defaults.withCredentials = true;

      if (state === 'Sign Up') {
        const { data } = await axios.post(`${backendUrl}/api/auth/register`, {
          name,
          email,
          password,
          role,
          specialCode
        });

        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          navigate('/');
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/auth/login`, {
          email,
          password
        });

        if (data.success) {
          // Set access token in default headers
          axios.defaults.headers['Authorization'] = `Bearer ${data.accessToken}`;
          setIsLoggedIn(true);
          getUserData();
          navigate('/');
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex items-center w-full justify-center min-h-screen sm:px-24 bg-gradient-to-b from-white to-violet-200">
      {/* Header Section */}
      <div className="absolute top-0 w-full bg-[#FFCA5C] border-b-2 border-gray-700 shadow-lg">
        <div className="flex flex-row justify-between items-center sm:px-24">
          {/* Logo */}
          <img
            onClick={() => navigate('/')}
            src={assets.logo_1}
            alt="Logo"
            className="w-28 sm:w-32 cursor-pointer"
          />
          {/* Heading */}
          <h1 className="flex-grow text-center text-xl sm:text-3xl font-bold"></h1>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-slate-800 p-10 rounded-lg shadow-lg w-full sm:w-96 mt-24">
        <h2 className="text-center font-semibold text-violet-300 mb-5 text-2xl">
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </h2>

        <form onSubmit={onSubmitHandler}>
          {state === 'Sign Up' && (
            <>
              {/* Name Input */}
              <div className="flex items-center gap-3 w-full mb-4 rounded-full px-5 py-3 bg-[#493a62]">
                <img src={assets.person_icon} alt="Person icon" />
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  className="bg-transparent outline-none text-gray-300"
                  type="text"
                  placeholder="Name"
                  required
                />
              </div>
              {/* Special Code Input */}
              <div className="flex items-center gap-3 w-full mb-4 rounded-full px-5 py-3 bg-[#493a62]">
                <img src={assets.lock_icon} alt="Password icon" />
                <input
                  onChange={(e) => {
                    setSpecialCode(e.target.value);
                    validateCode(e.target.value); // Validate code on change
                  }}
                  value={specialCode}
                  className="bg-transparent outline-none text-gray-300"
                  type="password"
                  placeholder="Special Code (if applicable)"
                />
              </div>
            </>
          )}
          {/* Email Input */}
          <div className="flex items-center gap-3 w-full mb-4 rounded-full px-5 py-3 bg-[#493a62]">
            <img src={assets.mail_icon} alt="Email icon" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-transparent outline-none text-gray-300"
              type="email"
              placeholder="Email"
              required
            />
          </div>
          {/* Password Input */}
          <div className="flex items-center gap-3 w-full mb-4 rounded-full px-5 py-3 bg-[#493a62]">
            <img src={assets.lock_icon} alt="Password icon" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="bg-transparent outline-none text-gray-300"
              type="password"
              placeholder="Password"
              required
            />
          </div>

          {/* Role Dropdown */}
          {state === 'Sign Up' && (
            <div className="flex items-center gap-3 w-full mb-4 rounded-full px-5 py-3 bg-[#493a62]">
              <select
                onChange={(e) => setRole(e.target.value)}
                value={role}
                className="bg-[#493a62]  text-gray-300"
                required
              >
                <option value="Employee">Employee</option>
                {isAdminCodeValid && <option value="Admin">Admin</option>} {/* Show Admin if Admin code is valid */}
                {isManagerCodeValid && <option value="Manager">Manager</option>} {/* Show Manager if Manager code is valid */}
              </select>
            </div>
          )}

          <p
            onClick={() => navigate('/reset-password')}
            className="text-violet-200 mb-4 cursor-pointer font-semibold"
          >
            Forgot Password?
          </p>

          {/* Submit Button */}
          <button className="rounded-lg w-full py-3 font-semibold bg-[#FFCA5C] hover:bg-[#ebad2d]">
            {state}
          </button>
        </form>
        {state === 'Sign Up' ? (
          <p className="mt-4 text-center text-violet-200">
            Already have an account?{' '}
            <span
              onClick={() => setState('Login')}
              className="cursor-pointer font-semibold underline text-violet-300"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="mt-4 text-center text-violet-200">
            Don't have an account?{' '}
            <span
              onClick={() => setState('Sign Up')}
              className="cursor-pointer font-semibold underline text-violet-300"
            >
              Sign Up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
