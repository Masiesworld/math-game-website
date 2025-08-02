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
        setpassword(event.target.value);
    }

    function handlePasswordConfirmChange(event){
        setpasswordConfirm(event.target.value);
    }

    async function confirmPasswordResetEmail() {
        console.log(`Attempting to change password to ${password} ...`);
        try {
            const response = await fetch('http://localhost:3001/users/update-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: localStorage.getItem("passwordResetEmail") || "", password: password, password_check: passwordConfirm })
            });

            console.log("after the await");
            const data = await response.json();

            console.log("after the await; data is: ");
            console.log(data);

            if (response.ok) {
                console.log("password reset successful");
                setMessage(data.message);
                navigate("/Sign-in");
            }
            else {
                console.log("password reset was not successful");
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

                <input value={password} onChange={handlePasswordChange} type='text' placeholder='New Password'/>
                <input value={passwordConfirm} onChange={handlePasswordConfirmChange} type='text' placeholder='Confirm New Password'/>

                <button className="btn btn-sm" onClick={confirmPasswordResetEmail}>Change Password</button>

                <p className={message.includes('successful') ? 'success-message' : 'error-message'}>{message}</p>
                </div>
            </div>
        </div>
    )
}

export default ConfirmPasswordReset