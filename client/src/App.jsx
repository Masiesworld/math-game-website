import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./App.css"
import NavBar from "./Components/Navbar"
import Footer from "./Components/Footer"
import Home from "./Pages/Home"
import Profile from "./Pages/Profile"

import SignIn from './Pages/Sign-in'
import SignUp from './Pages/Sign-up'

import PasswordReset from './Pages/PasswordReset'


function App({ questions, users }) {
  return (
    <div className='app-container'>
      {console.log("THIS IS CONFUSING")}
      <Router>
        <NavBar/>
          <Routes>
            <Route path="/" exact element= {<Home questions={questions} users={users}/>} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/Sign-in" element={<SignIn />} />
            <Route path="/Sign-up" element={<SignUp />} />
            <Route path="/PasswordReset" element={<PasswordReset />} />
          </Routes>

            <Footer/>
            
      </Router>
  </div>
  )
} 

export default App
