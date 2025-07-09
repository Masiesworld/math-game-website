    import { useState } from 'react'
    import { Link } from 'react-router-dom'
    import '../App.css'
    
    
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
    return(
        <div>
            <div className= "box-main">
                <div className='sign-up-form'>
                    <h2 className='align-end'>Username: <input value ={name} onChange={handleNameChange} type='text'/></h2>
                    <h2 className='align-end'>Email: <input value ={email} onChange={handleEmailChange} type='text'/></h2>
                    <h2 className='align-end'>Password: <input value ={password} onChange={handlePasswordChange} type='text'/></h2>
                    <h2 className='align-end'>Confirm Password: <input value ={passwordCheck} onChange={handlePasswordCheckChange} type='text'/></h2>

                    <Link to="/Sign-in" className="btn btn-sm">Create Account
                    {/* Check validity of enter info, if it is valid create account else display error*/}
                    </Link>
                </div>
            </div>
        </div>
         )
    }

    export default SignUp