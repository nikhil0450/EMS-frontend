//pages/CreateEmployee.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';

const CreateEmployee = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('');
  const [salary, setSalary] = useState(0);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(`${backendUrl}/api/employee/create-employee`, {
        name,
        email,
        position,
        department,
        salary,
        phone,
        address,
        city,
      });

      if (data.success) {
        toast.success('Employee created successfully!');
        navigate('/get-employees');
      } else {
        toast.error(data.message || 'Failed to create employee');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Something went wrong');
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
      <div className="bg-slate-800 p-10 rounded-lg shadow-lg w-full sm:w-[40rem] mt-24">
        <h2 className="text-center font-semibold text-violet-300 mb-5 text-2xl">
          Create Employee
        </h2>
        <form onSubmit={onSubmitHandler}>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {/* Name Input */}
            <div className="col-span-1 flex items-center gap-3 rounded-lg px-3 py-2 bg-[#493a62]">
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="bg-transparent outline-none text-gray-300 w-full"
                type="text"
                placeholder="Name"
                required
              />
            </div>

            {/* Email Input */}
            <div className="col-span-1 flex items-center gap-3 rounded-lg px-3 py-2 bg-[#493a62]">
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="bg-transparent outline-none text-gray-300 w-full"
                type="email"
                placeholder="Email"
                required
              />
            </div>

            {/* Position Input */}
            <div className="col-span-1 flex items-center gap-3 rounded-lg px-3 py-2 bg-[#493a62]">
              <input
                onChange={(e) => setPosition(e.target.value)}
                value={position}
                className="bg-transparent outline-none text-gray-300 w-full"
                type="text"
                placeholder="Position"
                required
              />
            </div>

            {/* Department Input */}
            <div className="col-span-1 flex items-center gap-3 rounded-lg px-3 py-2 bg-[#493a62]">
              <input
                onChange={(e) => setDepartment(e.target.value)}
                value={department}
                className="bg-transparent outline-none text-gray-300 w-full"
                type="text"
                placeholder="Department"
              />
            </div>

            {/* Salary Input */}
            <div className="col-span-1 flex items-center gap-3 rounded-lg px-3 py-2 bg-[#493a62]">
              <input
                onChange={(e) => setSalary(e.target.value)}
                value={salary}
                className="bg-transparent outline-none text-gray-300 w-full"
                type="number"
                placeholder="Salary"
              />
            </div>

            {/* Phone Input */}
            <div className="col-span-1 flex items-center gap-3 rounded-lg px-3 py-2 bg-[#493a62]">
              <input
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
                className="bg-transparent outline-none text-gray-300 w-full"
                type="text"
                placeholder="Phone"
              />
            </div>

            {/* Address Input */}
            <div className="col-span-1 flex items-center gap-3 rounded-lg px-3 py-2 bg-[#493a62]">
              <input
                onChange={(e) => setAddress(e.target.value)}
                value={address}
                className="bg-transparent outline-none text-gray-300 w-full"
                type="text"
                placeholder="Address"
              />
            </div>

            {/* City Input */}
            <div className="col-span-1 flex items-center gap-3 rounded-lg px-3 py-2 bg-[#493a62]">
              <input
                onChange={(e) => setCity(e.target.value)}
                value={city}
                className="bg-transparent outline-none text-gray-300 w-full"
                type="text"
                placeholder="City"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-5 rounded-lg w-full py-3 font-semibold bg-[#FFCA5C] hover:bg-[#ebad2d]"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );


};

export default CreateEmployee;
