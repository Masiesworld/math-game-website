import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./App.css"
import NavBar from "./Components/Navbar"
import Footer from "./Components/Footer"
import Home from "./Pages/Home"
import Profile from "./Pages/Profile"
import Teacher from "./Pages/Teacher"

import SignIn from './Pages/Sign-in'
import SignUp from './Pages/Sign-up'

import PasswordReset from './Pages/PasswordReset'
import ConfirmPasswordReset from './pages/ConfirmPasswordReset'

// App receives the questions and users from the database in the form of the questions and users variable
function App({ questions, users }) {
  return (
    <div className='app-container'>
      {/* Pages we can be directed to in the website */}
      <Router>
        <NavBar/>
          <Routes>
            <Route path="/" exact element= {<Home questions={questions} users={users}/>} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/Sign-in" element={<SignIn />} />

            {/* SignUp, PasswordReset, and ConfirmPasswordReset won't be visible on the NavBar I don't think */}
            <Route path="/Sign-up" element={<SignUp />} />
            <Route path="/PasswordReset" element={<PasswordReset />} />
            <Route path="/ConfirmPasswordReset" element={<ConfirmPasswordReset />} />

            <Route path="/Teacher" element={<Teacher />} />
          </Routes>
            <Footer/>
      </Router>
  </div>
  )
}

export default App
