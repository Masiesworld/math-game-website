    import React, { useState } from 'react'
    import { Link } from 'react-router-dom'
    import '../App.css'
    import './Sign-in.css'
    
    
    function SignIn(){

        const [name, setName] = useState("");
        const [password, setPassword] = useState("");
        const [message, setMessage] = useState("");

        function handleNameChange(event){
            setName(event.target.value);
        }

        const [password, setPassword] = useState("");

        function handlePasswordChange(event){
                setPassword(event.target.value)
        }

    return(
        <>
        <div className= 'box-main'>
        function handlePasswordChange(event){
            setPassword(event.target.value);
        }
        
       const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({username: name, password: password})
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
      } 
      else {
        setMessage(data.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Error connecting to backend');
    }
};
    return (
            /* <div class= "box-main">
                <h1>Placeholder for Sign in/ sign up link or popup?/reset password function</h1>
            </div> */

            <div className='sign-in-form'>
                <h2>Sign In</h2>
                <input value={name} onChange={handleNameChange} type='text' placeholder='Enter your username'/>
                <input value={password} onChange={handlePasswordChange} type='text' placeholder='Enter your password'/>
                {/* could delete later */}
                <p>Username: {name}</p> 
                <p>Reset password</p>
                <p>Don't have an account?</p>
                <Link to="/Sign-up" className="btn btn-sm">Sign Up</Link>

            </div>
        </div>    
        </>
         )
    }
                <input value={password} onChange={handlePasswordChange} type='text' placeholder='Enter your password'/>
                <button onClick={handleLogin}>Login</button>
                <p className={message.includes('successful') ? 'success-message' : 'error-message'}>
                    {message}
                </p>
            </div>
         );
}

    export default SignIn