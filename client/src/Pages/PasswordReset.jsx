import { useState } from 'react'
import '../App.css'
import './PasswordReset.css'


function PasswordReset(){
    const [Email, setEmail] = useState("")
    const [message, setMessage] = useState("");

    function handleEmailChange(event){
        setEmail(event.target.value);
    }

    async function sendPasswordResetEmail() {
        console.log(`Sending password reset email to ${Email} ...`);
        try {
            const response = await fetch('http://localhost:3001/emails/password-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: Email })
            });

            console.log("after the await");
            const data = await response.json();

            console.log("after the await; data is: ");
            console.log(data);

            if (response.ok) {
                console.log("password reset email successfully sent");
                setMessage(data.message);
            }
            else {
                console.log("password reset email was not sent");
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
                <input value={Email} onChange={handleEmailChange} type='text' placeholder='Enter your email'/>
                <button className="btn btn-sm" onClick={sendPasswordResetEmail}>Send email</button>
                <p className={message.includes('successful') ? 'success-message' : 'error-message'}>{message}</p>
                </div>
            </div>
        </div>
    )
}

export default PasswordReset