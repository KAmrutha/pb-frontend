import React from 'react'
import Home from './Components/Home'
import {Routes, Route } from 'react-router-dom';
import Signup from './Components/signup';
import Signin from './Components/Signin'
export default function App() {
  return (
    <Routes>

      <Route path="/signin" element={<Signin/>} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="*" element={<Home/>} />
    </Routes>
  )
}
