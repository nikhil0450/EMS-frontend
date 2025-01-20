//pages/EmailVerify.jsx
import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const EmailVerify = () => {

  axios.defaults.withCredentials = true

  const navigate = useNavigate()

  const { backendUrl, isLoggedIn, getUserData, userData } = useContext(AppContext)

  const inputRef = React.useRef([])

  const inputHandler = (e, index) => {
    if (e.target.value.length > 0 && index < inputRef.current.length - 1) {
      inputRef.current[index + 1].focus()
    }
  }

  const keyDownHandler = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRef.current[index - 1].focus()
    }
  }

  const submitHandler = async (e) => {
    try {
      e.preventDefault()
      const otpArray = inputRef.current.map(input => input.value)
      const otp = otpArray.join('')
      const { data } = await axios.post(backendUrl + '/api/auth/verify-account', { otp })

      if (data.success) {
        toast.success(data.message)
        getUserData()
        navigate('/')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.error(error)
      toast.error(error.message || 'Something went wrong')
    }
  }

  useEffect(() => {
    isLoggedIn && userData && userData.isAccountVerified && navigate('/')
  }, [isLoggedIn, userData])

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

      {/* OTP Form Section */}
      <form
        onSubmit={submitHandler}
        className="flex flex-col items-center justify-center w-full max-w-sm p-6 bg-slate-800 rounded-lg mt-16 sm:mt-24"
      >
        <h2 className="text-2xl font-semibold text-violet-300 mb-4">Enter OTP</h2>
        <p className="text-sm text-violet-200 mb-6">
          Please enter the 6-digit code sent to your email
        </p>

        {/* Responsive Input Fields */}
        <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 mb-6">
          {Array(6)
            .fill()
            .map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="w-12 h-12 border border-gray-700 rounded text-center 
                text-xl focus:outline-none focus:ring-2 focus:ring-yellow-300"
                ref={(e) => (inputRef.current[index] = e)}
                onInput={(e) => inputHandler(e, index)}
                onKeyDown={(e) => keyDownHandler(e, index)}
              />
            ))}
        </div>

        <button
          type="submit"
          className="bg-[#FFCA5C] text-gray-800 px-16 py-2 
          rounded-lg hover:bg-[#ebad2d] transition font-semibold"
        >
          Verify Email
        </button>
        <p className="text-sm text-violet-200 mt-4">
          Press Backspace to return to the previous input field
          {/* <span className="text-violet-400 cursor-pointer flex justify-center font-bold">Resend</span> */}
        </p>
      </form>
    </div>
  );

};

export default EmailVerify