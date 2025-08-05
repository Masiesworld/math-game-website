import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../App.css'
import './PasswordReset.css'

function ConfirmPasswordReset(){
    const [password, setpassword] = useState("")
    const [passwordConfirm, setpasswordConfirm] = useState("")
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    function handlePasswordChange(event){
        // Set password to the user's input
        setpassword(event.target.value);
    }

    function handlePasswordConfirmChange(event){
        // Set passwordConfirm to the user's input
        setpasswordConfirm(event.target.value);
    }

    // Call the backend to attempt to change the user's password
    async function confirmPasswordResetEmail() {
        try {
            const response = await fetch('http://localhost:3001/users/update-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: localStorage.getItem("passwordResetEmail") || "", password: password, password_check: passwordConfirm })
            });

            const data = await response.json();

            // If successful, display that the reset was successful and redirect the user back to the Sign In page
            if (response.ok) {
                setMessage(data.message);
                navigate("/Sign-in");
            }
            else {
                // Otherwise, display the error that occured in attempting to change the password
                // Ideally we have the same 2 requirements: password might be at least 8 characters long, and password should == confirm password
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
                <div className="passwordReset">
                <h2>Enter your new password:</h2>

                {/* text boxes to enter the new password and confirm the new password */}
                <input value={password} onChange={handlePasswordChange} type='text' placeholder='New Password'/>
                <input value={passwordConfirm} onChange={handlePasswordConfirmChange} type='text' placeholder='Confirm New Password'/>

                {/* confirm the password reset, call the backend */}
                <button className="btn btn-sm" onClick={confirmPasswordResetEmail}>Change Password</button>

                <p className={message.includes('successful') ? 'success-message' : 'error-message'}>{message}</p>
                </div>
            </div>
        </div>
    )
}

export default ConfirmPasswordReset