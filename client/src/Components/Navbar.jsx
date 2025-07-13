import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import './Navbar.css'

function NavBar(){

  const [signedIn, setSignedIn] = useState(false);

  const handleSignInToggle = () =>{
    setSignedIn(!signedIn);
  };

  const statusText = signedIn ? 'Signed In' : 'Guest';

    return(
    <div>
      <nav className="navbar navbar-background">
        <div className ="title">
            <h1>Math Trials</h1>
        </div>
      {/* If user is NOT signed in */}
        <ul className="nav-list">
          <li>
                <Link to="/Profile" className="btn btn-sm">Profile</Link>
              </li>
          <li>
            <Link to="/" className="btn btn-sm">Home</Link>
          </li>

          {!signedIn && (
            <li>
              <Link to="/Sign-in" className='btn btn-sm'>Sign In</Link>
            </li>
            
          )}
          {/* If user is signed in */}
          {signedIn && (
            <>
              <li>
                <Link to="/Profile" className="btn btn-sm">Profile</Link>
              </li>
              <button className='btn btn-sm' onClick={() => setSignedIn(false)}>Log out</button>
            </>
          )}


        </ul>
      </nav>
    </div>
    )
}

export default NavBar