import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./App.css"
import NavBar from "./Components/Navbar"
import Footer from "./Components/Footer"
import Home from "./Pages/Home"
import Profile from "./Pages/Profile"

import Signin from './Pages/Sign-in'

function App() {
  return (
    <div className='app-container'>
      <Router>
        <NavBar/>

          <Routes>
            <Route path="/" exact element= {<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/Sign-in" element={<Signin />} />
          </Routes>

            <Footer/>
            
      </Router>
  </div>
  )
} 

export default App
