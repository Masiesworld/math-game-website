    import { useState, useEffect, lazy, Suspense } from 'react'
    import { ToastContainer, toast } from 'react-toastify';
    import 'react-toastify/dist/ReactToastify.css';
    import '../App.css'
    import './Profile.css'
    import '../Components/Leaderboards.css'
    import MusicControls from '../Components/MusicControls.jsx';
    const Leaderboards = lazy(() => import('../Components/Leaderboards.jsx'));
    
    function Profile(){
        const [name, setName] = useState("");
            function handleNameChange(event){
                setName(event.target.value);
            }
        const [originalUsername, setOriginalUsername] = useState("");
        const [email, setEmail] = useState("");
                function handleEmailChange(event){
                    setEmail(event.target.value)
                }
        const [password, setPassword] = useState("");
                function handlePasswordChange(event){
                    setPassword(event.target.value)
                }
        const [classroom, setClassRoomCheck] = useState("");
        const [totalScore, setTotalScore] = useState(0);
        const [editMode, setEditMode] = useState(false);
    // Fetch user info on mount
    useEffect(() => {
        const username = localStorage.getItem("username");
        
        if (!username) return;

        fetch(`http://localhost:3001/users/${originalUsername}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
          .then(res => res.json())
          .then(data => {
              const user = data.find(u => u.username === username);
              if (user) {
                setOriginalUsername(user.username); // ← Track original username
                setName(user.username || "");
                setEmail(user.email || "");
                setClassRoomCheck(user.class_number !== undefined ? user.class_number : "");
                setPassword(user.password || "");
                setTotalScore(user.total_score || 0);
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
    const username = localStorage.getItem("username");
    if (!username) return;

    setAvatarPath(path);
    localStorage.setItem("avatar", path);
    setShowPicker(false);

    fetch(`http://localhost:3001/users/update-avatar`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username, // Use stored username
            avatar: path,
        }),
    })
    .then(res => {
    if (!res.ok) {
        throw new Error("Failed to update avatar");
    }
    return res.json();
    })
    .then(data => {
        toast.success('Avatar Updated!');
        // Avatar updated
    })
    .catch(err => {
        console.error("Avatar failed to change:", err);
        alert(err.message); // Will show the actual error message like "Username already taken"
    });
    }

    function handleSave() {
  const username = localStorage.getItem("username");
  if (!username) return;

  fetch(`http://localhost:3001/users/${originalUsername}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      newUsername: name, 
      email,
      password,
    }),
  })
   .then(res => {
    if (res.status === 409) {
        throw new Error("Username already taken");
    }
    if (!res.ok) {
        throw new Error("Failed to update profile");
    }
    return res.json();
    })
    .then(data => {
    // Profile updated
    setEditMode(false);
    localStorage.setItem("username", name); // Update stored username
    setOriginalUsername(name); // Update stored username
    toast.success('Profile Updated!');
    })
    .catch(err => {
    console.error("Error updating profile:", err);
    alert(err.message); // Will show the actual error message like "Username already taken"
    });

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
                        <div className="top-right-display">
                                <h2>Class Number: {classroom}</h2>
                                <h2> Total Score: {totalScore}</h2>
                                </div>
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
                        <MusicControls />
                    </div>
                    <div className="leaderboards">
                        <Suspense fallback={<div>Loading Leaderboards...</div>}>
                            <Leaderboards />
                        </Suspense>
                    </div>
            </div>
            <ToastContainer />
        </div>
         )
    }

    export default Profile