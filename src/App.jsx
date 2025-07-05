import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./App.css"
import NavBar from "./Components/Navbar"
import Footer from "./Components/Footer"
import Home from "./Pages/Home"
import Profile from "./Pages/Profile"

function App() {
  return (
    <Router>
      <NavBar/>
    <Routes>
      <Route path="/" exact element= {<Home />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
          <Footer/>
  </Router>
  )
}

export default App
