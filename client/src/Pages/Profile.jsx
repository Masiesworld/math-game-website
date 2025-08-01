    import { useState, useEffect, lazy, Suspense } from 'react'
    import '../App.css'
    import './Profile.css'
    import '../Components/Leaderboards.css'
    const Leaderboards = lazy(() => import('../Components/Leaderboards.jsx'));
    
    
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
    const [editMode, setEditMode] = useState(false);
    // Fetch user info on mount
    useEffect(() => {
        const username = localStorage.getItem("username");
        if (!username) return;

        fetch("http://localhost:3001/users", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
          .then(res => res.json())
          .then(data => {
              const user = data.find(u => u.username === username);
              if (user) {
                  setName(user.username || "");
                  setEmail(user.email || "");
                  setClassRoomCheck(user.class_number !== undefined ? user.class_number : "");
                  setPassword(user.password || "");
              }
          })
          .catch(err => console.error("Failed to fetch user info:", err));
    }, []);

    // Avatar handling
    const avatarOptions = [
        "/cat.png",
        "/duck.png",
        "/meerkat.png",
        "/panda.png",
        "/rabbit.png",
    ];

    const storedAvatar = localStorage.getItem("avatar") || "/cat.png";
    const [avatarPath, setAvatarPath] = useState(storedAvatar);
    const [showPicker, setShowPicker] = useState(false);

    function togglePicker() {
        setShowPicker(prev => !prev);
    }

    function handleAvatarSelect(path) {
        setAvatarPath(path);
        localStorage.setItem("avatar", path);
        setShowPicker(false);
    }

    function handleSave() {
        setEditMode(false);
    }
    
    const [originalData, setOriginalData] = useState({
        name: "",
        email: "",
        classroom: "", 
        password: "",
    });

    function handleCancel() {
        setName(originalData.name);
        setEmail(originalData.email);
        setClassRoomCheck(originalData.classroom);
        setPassword(originalData.password);
        setEditMode(false);
    }

    function handleEdit() {
        if (!editMode){
            setOriginalData({name, email, classroom, password});
        }
        setEditMode(true);
    }

    return(
        <div>
            <div className= "box-main">
                    <div className="Profile">
                        <div className="avatar-container">
                            <img src={avatarPath} alt="Profile Avatar" className="profile-avatar" />
                            <button className="change-avatar-btn btn btn-sm" onClick={togglePicker}>Change Profile Picture</button>
                        </div>

                        {showPicker && (
                            <div className="avatar-options">
                                {avatarOptions
                                    .filter(path => path !== avatarPath)
                                    .map(path => (
                                        <img
                                            key={path}
                                            src={path}
                                            alt="avatar option"
                                            className="avatar-thumb"
                                            onClick={() => handleAvatarSelect(path)}
                                        />
                                ))}
                            </div>
                        )}
                        <div className="information">
                            <div className="row">
                                <label>Name:</label> 
                                <input value ={name} onChange={handleNameChange} type='text' placeholder={name} readOnly={!editMode}/>
                                </div>
                            <div className="row">
                                <label>Email:</label> 
                                <input value ={email} onChange={handleEmailChange} type='text' placeholder={email} readOnly={!editMode}/>
                                </div>
                            <div className="row">
                                <label>Class:</label> 
                                <input value ={classroom} onChange={handleClassRoomChange} type='text' placeholder={classroom} readOnly={!editMode}/>
                                </div>
                            <div className="row">
                                <label>Password:</label> 
                                <input value ={password} onChange={handlePasswordChange} type='text' placeholder={password} readOnly={!editMode}/>
                                </div>
                            <div className="Edit">
                                { editMode ? (
                                    <>
                                    <button className="btn btn-sm" onClick={handleSave}>Save</button>
                                    <button className="btn btn-sm" onClick={handleCancel}>Cancel</button>
                                    </>
                                ) :(
                                <button className="btn btn-sm" onClick={() => handleEdit(true)}>Edit</button>
                                )}                               
                            </div>
                        </div>
                    </div>
                    <div className="leaderboards">
                        <Suspense fallback={<div>Loading Leaderboards...</div>}>
                            <Leaderboards />
                        </Suspense>
                    </div>
            </div>
        </div>
         )
    }

    export default Profile