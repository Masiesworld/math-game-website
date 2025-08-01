import React, {useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import '../App.css'
import './Navbar.css'

function NavBar(){

  const [signedIn, setSignedIn] = useState(!!localStorage.getItem("username"));
  const [role, setRole] = useState(localStorage.getItem("role"));



  const handleSignOutToggle = () =>{ 
    localStorage.removeItem("username");  //Removes Username from local storage
    setSignedIn(false);                   //Change signin to false
    //window.location.reload();             //Reload window after sign out

    // Redirect back to the homepage when the user logs out
    // Kind of hardcoded with the URL, so we might need to change this if needed
    window.location.replace("http://localhost:5173/");
  };

  useEffect(() => { //Listens for events to change the SignIn status
    const handleSignInToggle = () =>{
    setSignedIn(!signedIn);
    setRole(localStorage.getItem("role")); 
    };


    window.addEventListener("Login", handleSignInToggle);
    return () => window.removeEventListener("Login", handleSignInToggle);
  }, []);

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
              <li>
              <button className='btn btn-sm' onClick={handleSignOutToggle}>Log out</button>
              </li>
            </>
          )}
          {/* Teacher page only visible if logged in as teacher*/}
          {signedIn && role === "teacher" && (
            <li>
              <Link to="/Teacher" className="btn btn-sm">Teacher Page</Link>
            </li>
          )}
          {/* Display the current sign-in status */}


        </ul>
      </nav>
    </div>
    )
}

export default NavBar