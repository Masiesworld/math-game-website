    import { useState } from 'react'
    import '../App.css'
    import './PasswordReset.css'
    
    
    function PasswordReset(){
        const [Email, setEmail] = useState("")

        function handleEmailChange(event){
      setEmail(event.target.value);
  }
    return(
        <div>
            <div className= "box-main">
                <div className="passwordReset">
                <h2>Enter the email of the account</h2>
                <input value={Email} onChange={handleEmailChange} type='text' placeholder='Enter your email'/>
                <button className="btn btn-sm">Send email</button>
                </div>
            </div>
        </div>
         )
    }

    export default PasswordReset