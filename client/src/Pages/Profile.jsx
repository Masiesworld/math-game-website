    import { useState } from 'react'
    import '../App.css'
    import './Profile.css'
    
    
    function Profile(){
    return(
        <div>
            <div className= "box-main">
                <div className="Profile">
                    <h1>Placeholder for details such as picture/class affiliation/personal scores?/ability to change details</h1>
                    <div className="information">
                        <h2>Name: </h2>
                        <h2>Email: </h2>
                        <h2>Class: </h2>
                        <h2>Password: </h2>
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