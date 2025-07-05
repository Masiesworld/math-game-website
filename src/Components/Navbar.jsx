import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import './Navbar.css'

function NavBar(){
    return(
        <div>
      <nav className="navbar background">
        <div class ="title">
            <h1>Math Trials</h1>
          </div>
        <ul className="nav-list">
          <li>
            <Link to="/" className="btn btn-sm">Home</Link>
          </li>
          <li>
            <Link to="/Profile" className="btn btn-sm">Profile</Link>
          </li>
        </ul>
      </nav>
      </div>
    )
}

export default NavBar