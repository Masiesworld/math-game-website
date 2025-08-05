import {useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import './Navbar.css'

// A component to display the navigation menu on the top of the website
function NavBar(){
  const [signedIn, setSignedIn] = useState(!!localStorage.getItem("username"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  const handleSignOutToggle = () =>{ 
    localStorage.removeItem("username");     // Removes Username from local storage
    localStorage.removeItem("role");         // Removes Role from local storage
    localStorage.removeItem("avatar");       // Removes Avatar from local storage
    localStorage.removeItem("class_number"); // Removes Class Number from local storage
    localStorage.removeItem("total_score");  // Removes Total Score from local storage
    localStorage.removeItem("email");        // Removes Email from local storage
    localStorage.removeItem("password");     // Removes Password from local storage
    setSignedIn(false);                      // Change signin to false
    window.location.href = "/";              // Reload window after sign out and redirect to home page 
  };

  useEffect(() => { // Listens for events to change the SignIn status
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
          {/* Teacher page only visible if logged in as teacher */}
          {signedIn && role === "teacher" && (
            <li>
              <Link to="/Teacher" className="btn btn-sm">Teacher Page</Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
    )
}

export default NavBar