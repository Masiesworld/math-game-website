import { useState } from 'react'
import '../App.css'
import './PasswordReset.css'

// A component for the user to send a password reset email to their email
function PasswordReset() {
    const [Email, setEmail] = useState("")
    const [message, setMessage] = useState(""); // Message to the displayed depending on the state of the backend calls
    
    function handleEmailChange(event){
        // Set Email to the user's input
        setEmail(event.target.value);
    }

    // Call the backend to send a password reset email to the user
    async function sendPasswordResetEmail() {
        // initiate password reset email request
        try {
            const response = await fetch('http://localhost:3001/emails/password-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: Email })
            });

            const data = await response.json();

            /* If the email sending was successful, note the user's email in local storage
               so we can identify the user's account to reset the password of */
            if (response.ok) {
                localStorage.setItem("passwordResetEmail", Email);

                // successful email sent
                setMessage(data.message);
            }
            else {
                // email send failed
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
                <h2>Enter the email of the account</h2>

                {/* text boxes to enter the email to send a password reset email to */}
                <input value={Email} onChange={handleEmailChange} type='text' placeholder='Enter your email'/>

                <button className="btn btn-sm" onClick={sendPasswordResetEmail}>Send email</button>
                <p className={message.includes('successful') ? 'success-message' : 'error-message'}>{message}</p>
                </div>
            </div>
        </div>
    )
}

export default PasswordReset