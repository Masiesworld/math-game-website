    import React, { useEffect, useState } from 'react'
    import '../App.css'
    
    
    function Signin(){

        const [name, setName] = useState("");
        const [password, setPassword] = useState("");
        const [message, setMessage] = useState('Loading...');

        function handleNameChange(event){
            setName(event.target.value);
        }

        function handlePasswordChange(event){
            setPassword(event.target.value);
        }

        /*
        useEffect(() => {
            fetch('http://localhost:5000/login')
              .then(res => res.json())
              .then(data => setMessage(data.message))
              .catch(err => {
                console.error('Error fetching from backend:', err);
                setMessage('Error connecting to backend');
              });
          }, []);
        */
    return(
        <>
            {/* <div class= "box-main">
                <h1>Placeholder for Sign in/ sign up link or popup?/reset password function</h1>
            </div> */}

            <div className='sign-in-form'>
                <h2>Sign In</h2>
                <input value={name} onChange={handleNameChange} type='text' placeholder='Enter your username'/>
                <input value={password} onChange={handlePasswordChange} type='text' placeholder='Enter your password'/>
                {/* could delete later */}
                <p>Username: {name}</p>
                <p>Password: {password}</p>
                
            </div>
        </>
         )
    }

    export default Signin