    import { useState } from 'react'
    import '../App.css'
    import './Profile.css'
    
    
    function Profile(){
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
    const [classroom, setClassRoomCheck] = useState("");
            function handleClassRoomChange(event){
                setClassRoomCheck(event.target.value)
            }

    return(
        <div>
            <div className= "box-main">
                <div className="Profile">
                    <h1>Placeholder for details such as picture/class affiliation/personal scores?/ability to change details</h1>
                    <div className="information">
                        <div className="row">
                            <label>Name: <input value ={name} onChange={handleNameChange} type='text' placeholder={name}/></label>
                            </div>
                        <div className="row">
                            <label>Email: <input value ={email} onChange={handleEmailChange} type='text' placeholder={email}/></label>
                            </div>
                        <div className="row">
                            <label>Class: <input value ={classroom} onChange={handleClassRoomChange} type='text' placeholder={classroom}/></label>
                            </div>
                        <div className="row">
                            <label>Password: <input value ={password} onChange={handlePasswordChange} type='text' placeholder={password}/></label>
                            </div>
                        <div className="PassChange">
                            <p>Change Password?</p> 
                            <button className="btn btn-sm">Change</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
         )
    }

    export default Profile