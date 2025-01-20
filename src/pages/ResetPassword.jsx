//pages/ResetPassword.jsx
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const ResetPassword = () => {

  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [otp, setOtp] = useState(0)
  const [otpSubmited, setOtpSubmited] = useState(false)


  axios.defaults.withCredentials = true

  const { backendUrl } = useContext(AppContext)

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

  const submitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/reset-otp',
        { email })
      console.error(data.mesage)
      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && setEmailSent(true)
    }
    catch (error) {
      console.error(error)
      toast.error(error.message || 'Something went wrong')
    }
  }

  const submitOTP = (e) => {
    e.preventDefault();
    const otpArray = inputRef.current.map((input) => input.value)
    setOtp(otpArray.join(''))
    setOtpSubmited(true)
  }

  const submitNewPassword = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/reset-password',
        { email, otp, newPassword })
      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && navigate('/login')
    }
    catch (error) {
      toast.error(error.message || 'Something went wrong')
    }
  }

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

      {!emailSent &&
        <form onSubmit={submitEmail} className="flex flex-col items-center justify-center w-full max-w-sm p-6 bg-slate-800 shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold text-violet-300 mb-4">Reset Password</h2>
          <p className="text-sm text-violet-200 mb-6">
            Please enter your registered email address
          </p>
          <div className='flex items-center w-full mb-4 gap-3 px-5 py-3 rounded-full bg-[#493a62]'>
            <img src={assets.mail_icon} alt="Email" />
            <input className='bg-transparent outline-none text-gray-300'
              type="email" placeholder='Email'
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button className='rounded-lg w-full py-3 font-semibold bg-[#FFCA5C] hover:bg-[#ebad2d]'>Submit</button>
          <p className="text-sm text-violet-200 mt-3">
            Back to {" "}<span onClick={() => navigate('/login')}
              className="cursor-pointer font-semibold underline text-violet-300">Login</span>
          </p>
        </form>
      }

      {!otpSubmited && emailSent &&
        <form onSubmit={submitOTP} className="flex flex-col items-center justify-center w-full max-w-sm p-6 bg-slate-800 shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold text-violet-300 mb-4">Reset Password OTP</h2>
          <p className="text-sm text-violet-200 mb-6">
            Please enter the 6-digit code sent to your email
          </p>
          <div className="flex space-x-2 mb-6">
            {Array(6)
              .fill()
              .map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className="w-12 h-12 border border-gray-700 rounded text-center 
              text-xl focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  ref={(e) => inputRef.current[index] = e}
                  onInput={(e) => inputHandler(e, index)}
                  onKeyDown={(e) => keyDownHandler(e, index)}
                />
              ))}
          </div>
          <button
            type="submit"
            className="bg-[#FFCA5C] text-gray-800 px-16 py-2 
          rounded-lg hover:bg-[#ebad2d] transition font-semibold">
            Submit
          </button>
          <p className="text-sm text-violet-200 mt-4">
            Press Backspace to return to the previous input field
          </p>
        </form>
      }

      {otpSubmited && emailSent &&
        <form onSubmit={submitNewPassword} className="flex flex-col items-center justify-center w-full max-w-sm p-6 bg-slate-800 shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold text-violet-300 mb-4">New Password</h2>
          <p className="text-sm text-violet-200 mb-6">
            Please enter the new password bellow
          </p>
          <div className='flex items-center gap-3 w-full mb-4 rounded-full px-5 py-3 bg-[#2b4054]'>
            <img src={assets.lock_icon} alt="Person icon" />
            <input onChange={e => setNewPassword(e.target.value)} value={newPassword}
              className='bg-transparent outline-none text-gray-300' type='password' placeholder='New Password' required />
          </div>
          <button className='rounded-lg w-full py-3 font-semibold bg-[#FFCA5C] hover:bg-[#ebad2d]'>Submit</button>
        </form>
      }
    </div>
  );
}

export default ResetPassword