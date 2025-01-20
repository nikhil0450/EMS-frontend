// components/Header.jsx
import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import robo_logo from '../assets/robo_logo.png'

const Header = () => {

  const navigate = useNavigate()

  const { userData, isLoggedIn } = useContext(AppContext)

  return (
    <div className='flex flex-col items-center mt-20 px-6 sm:px-8 text-center text-gray-800'>

      {/* Account Verification Notice */}
      {!userData?.isAccountVerified && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 px-6 py-3 rounded-lg shadow-md mb-6" role="alert">
          <strong className="font-semibold">Notice: </strong>
          <span className="block sm:inline">Please verify your account to gain full access to the app.</span>
        </div>
      )}

      {/* Logo */}
      <img src={robo_logo} alt='Header image'
        className='w-36 h-36 rounded-full mb-6' />

      {/* Greeting */}
      <h1 className='flex items-center gap-3 text-xl sm:text-3xl font-semibold mb-2'>
        Hey {userData && userData.role} {userData ? userData.name : 'Colleague'}!
        <img src={assets.hand_hi} alt="Hand wave" className='w-8 h-8' />
      </h1>

      {/* Welcome Text */}
      <h2 className='text-3xl sm:text-5xl mb-4 font-extrabold text-gray-900'>Welcome to our App</h2>

      {/* Conditional Content Based on Login State */}
      {isLoggedIn === false ? (
        <>
          <p className='mb-8 max-w-md text-gray-600'>Get started—just click the button below to begin your journey through our secure and complete Authentication System!</p>
          <button onClick={() => navigate('/login')} className='bg-purple-700 text-white rounded-full px-8 py-3 text-lg font-semibold hover:bg-purple-600 transition duration-200'>
            Get Started
          </button>
        </>
      ) : (
        <p className='mb-8 max-w-md text-gray-600'>Your journey has just started through our secure and complete Authentication System!</p>
      )}
    </div>
  )
}

export default Header
