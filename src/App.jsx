//App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import GetEmployees from './pages/GetEmployees'
import CreateEmployee from './pages/CreateEmployee'
import GetEmployee from './pages/GetEmployee'

const App = () => {
  return (
    <div>
     <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/get-employees" element={<GetEmployees />} />
        <Route path="/create-employee" element={<CreateEmployee />} />
        <Route path="/get-employee" element={<GetEmployee />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </div>
  )
}

export default App