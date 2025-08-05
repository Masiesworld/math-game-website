import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import '../App.css'
import './Sign-in.css'

function SignIn(){
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function handleNameChange(event) {
    setName(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value)
  }
  
  // A fucntion to call the backend to validate the user's attempt to sign in
  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({username: name, password: password})
      });

      const data = await response.json();

      // If the sign in is successful
      if (response.ok) {
         setMessage(data.message);

        // Give the local storage the user's username so it knows that the user is logged in + what account the user is logged into
        localStorage.setItem("username", name);
        localStorage.setItem("role", data.role);
        localStorage.setItem("avatar", data.avatar);
        window.dispatchEvent(new Event("Login")); //Dispatch an event for login so other components can update
        if (data.role === "student") {
            navigate('/'); // Redirect to Home.jsx for students
        }
        else if (data.role === "teacher") {
            navigate('/Teacher'); // Redirect to Teacher.jsx for teachers
        }
      } 
      else {
        // Otherwise, display the error that occured
        setMessage(data.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Error connecting to backend');
    }
  };
  
  return (
    <div className= "box-main">
      <div className='sign-in-form'>
          <h2>Sign In</h2>
          {/* text boxes to enter sign in information */}
          <input value={name} onChange={handleNameChange} type='text' placeholder='Enter your username'/>
          <input value={password} onChange={handlePasswordChange} type='text' placeholder='Enter your password'/>

          {/* commented out because this was used for debugging */}
          {/* <p>Username: {name}</p> */}

          {/* link to password reset */}
          <Link to="/PasswordReset" className="passwordChange">Reset password</Link>

          <p>Don't have an account?</p>
          {/* make a new account / log in */}
          <Link to="/Sign-up" className="btn btn-sm">Sign Up</Link> 
          <button className="btn btn-sm" onClick={handleLogin}>Login</button>

          {/* resulting message */}
          <p className={message.includes('successful') ? 'success-message' : 'error-message'}>
              {message}
          </p>
      </div>
    </div>
  );
}

export default SignIn