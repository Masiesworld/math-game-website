import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import './Sign-up.css';

function SignUp(){

    const [name, setName] = useState("");
            function handleNameChange(event){
                setName(event.target.value);
            }
    const [email, setEmail] = useState("");
            function handleEmailChange(event){
                setEmail(event.target.value)
            }
    const [password, setPassword] = useState("");
            function handlePasswordChange(event){
                setPassword(event.target.value)
            }
    const [passwordCheck, setPasswordCheck] = useState("");
            function handlePasswordCheckChange(event){
                setPasswordCheck(event.target.value)
            }

    const [adminChecked, setIsChecked] = useState(false);
            function HandleCheck(event){
                setIsChecked(event.target.checked);
            }
    const [message, setMessage] = useState("");
    
    const navigate = useNavigate();

    async function validateUser() {
        console.log("VALIDATE USER");
        try {
            const response = await fetch('http://localhost:3001/sign-up', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({username: name, email: email, password: password, password_check: passwordCheck, role: adminChecked ? "teacher" : "student"}) // role parameter added, "student" or "teacher"
            });

            console.log("after the await");
            const data = await response.json();

            console.log("after the data; data is: ");
            console.log(data);

            if (response.ok) {
                // Send confirmation email
                await fetch('http://localhost:3001/emails/registration-confirmation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({email: email, username: name})
                });
                
                setMessage(data.message);
                navigate("/Sign-in");
            }
            else {
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
                    <p>Account Type <input type='checkbox' checked={adminChecked} onChange={HandleCheck}/>Teacher</p>
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

                    <button className="btn btn-sm" onClick={validateUser}>Create Account</button>

                    <p className={message.includes('successful') ? 'success-message' : 'error-message'}>{message}</p>
                </div>
            </div>
        </div>
    )
}

export default SignUp

/*
<Link to="/Sign-in" className="btn btn-sm" onClick={validateUser}>Create Account
                    {Check validity of entered info, if it is valid create account else display error
                    }
                    </Link>
*/