    import React, { useState } from 'react'
    import { Link } from 'react-router-dom'
    import '../App.css'
    
    
    function SignIn(){

        const [name, setName] = useState("");

        function handleNameChange(event){
            setName(event.target.value);
        }

    return(
        <>
            {/* <div class= "box-main">
                <h1>Placeholder for Sign in/ sign up link or popup?/reset password function</h1>
            </div> */}
        <div className= 'box-main'>
            <div className='sign-in-form'>
                <h2>Sign In</h2>
                <input value={name} onChange={handleNameChange} type='text' placeholder='Enter your username'/>
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

    export default SignIn