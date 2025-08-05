import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import './Sign-up.css';

// A page for the user to create a new account 
function SignUp(){
    // Username
    const [name, setName] = useState("");
    function handleNameChange(event){
        setName(event.target.value);
    }

    // Email
    const [email, setEmail] = useState("");
    function handleEmailChange(event){
        setEmail(event.target.value)
    }

    // Password
    const [password, setPassword] = useState("");
    function handlePasswordChange(event){
        setPassword(event.target.value)
    }

    // Confirm Password
    const [passwordCheck, setPasswordCheck] = useState("");
    function handlePasswordCheckChange(event){
        setPasswordCheck(event.target.value)
    }

    // Teacher Account Checkbox
    const [adminChecked, setIsChecked] = useState(false);
    function HandleCheck(event){
        setIsChecked(event.target.checked);
    }

    // Account Creation Status
    const [message, setMessage] = useState("");
    
    // This is used to navigate the user back to the Sign In page if the account creation is successful
    const navigate = useNavigate();

    // Upon the user creating an account, validate that this is a valid account that can be added to the database
    async function validateUser() {
        // VALIDATE USER (debug log removed)
        try {
            const response = await fetch('http://localhost:3001/sign-up', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({username: name, email: email, password: password, password_check: passwordCheck, role: adminChecked ? "teacher" : "student"}) // role parameter added, "student" or "teacher"
            });

            // debug removed
            const data = await response.json();

            // debug removed
            
            // If the account creation is successful
            if (response.ok) {
                // Send confirmation email
                await fetch('http://localhost:3001/emails/registration-confirmation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({email: email, username: name})
                });
                
                setMessage(data.message);

                // Redirect the user back to the Sign In page
                navigate("/Sign-in");
            }
            else {
                // Otherwise, display the error that occurred
                setMessage(data.error);
            }
        } catch (error) {
            console.error('Login error:', error);
            setMessage('Error connecting to backend');
        }
    }

    return(
        <div>
            <div className= "box-main">
                <div className='sign-up-form'>
                    {/* select the type of account */}
                    <p>Account Type <input type='checkbox' checked={adminChecked} onChange={HandleCheck}/>Teacher</p>

                    {/* text boxes for the user to enter account credentials */}
                    <div className="row">
                        <h2>Username:</h2> 
                        <input value ={name} onChange={handleNameChange} type='text'/>
                    </div>
                    <div className="row">
                        <h2>Email:</h2> 
                        <input value ={email} onChange={handleEmailChange} type='text'/>
                    </div>
                    <div className="row">
                        <h2>Password:</h2> 
                        <input value ={password} onChange={handlePasswordChange} type='text'/>
                    </div>
                    <div className="row">    
                        <h2>Confirm Password:</h2> 
                        <input value ={passwordCheck} onChange={handlePasswordCheckChange} type='text'/>
                    </div>

                    {/* create the account */}
                    <button className="btn btn-sm" onClick={validateUser}>Create Account</button>

                    {/* was account creation successful? */}
                    <p className={message.includes('successful') ? 'success-message' : 'error-message'}>{message}</p>
                </div>
            </div>
        </div>
    )
}

export default SignUp
