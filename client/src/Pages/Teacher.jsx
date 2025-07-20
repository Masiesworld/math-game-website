import React, { useState, useEffect, useRef } from 'react';
import '../App.css'
import './Teacher.css'

function Teacher() {
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const buttonRef = useRef();
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const Assign = async () => {
        if (selectedUser && selectedClass) {
            try {
                const response = await fetch('http://localhost:3001/admin/assign', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    username: selectedUser,
                    class_number: selectedClass
                  }),
                });
                if (response.ok) {
                  await response.json();
                  alert('Class number assigned successfully!');
                } 
                else {
                   const error = await response.text();
                   alert(`Error: ${error}`);
                }
            } 
            catch (error) {
              console.error('Assignment failed:', error);
              alert('An error occurred during assignment.');
            }
          }
        };

    const toggleUserDropdown = () => {
    setIsUserDropdownOpen(prev => !prev);
    setIsClassDropdownOpen(false); // close the other
    };

    const toggleClassDropdown = () => {
    setIsClassDropdownOpen(prev => !prev);
    setIsUserDropdownOpen(false); // close the other
    };



  // 🔁 Fetch users from backend on component mount
  useEffect(() => {
    fetch('http://localhost:3001/admin/users') // adjust if needed
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error('Error fetching users:', err));
  }, []);

  return (
    <div className="box-main">
      <div className="teacher-block">
        <h1 className = "header-title">Teacher Page</h1>
        <h2>Assign Class Number</h2>
        <div className="dropdown-wrapper">
          <button ref={buttonRef} className="teach-btn" onClick={toggleUserDropdown}>
            Select Student
          </button>

          {isUserDropdownOpen && (
            <div className="dropdown-menu">
              <p>Select Student</p>
              <ul>
                {users
                    .filter(user => user.role === "student") // Filter to show only students
                    .map((user, index) => (
                    <li key={index}
                    onClick = {() => {
                      setSelectedUser(user.username);
                      setIsUserDropdownOpen(false);
                    }}
                    className = "dropdown-item"
                    >
                        {user.username}
                        </li>
                    ))
                }
              </ul>
            </div>
          )}
        </div>
        {selectedUser && (
            <div className="selected-box">
                <h3>{selectedUser}</h3>
            </div>
        )}

      {selectedUser && (
        <div className="dropdown-wrapper">
          <button ref={buttonRef} className="teach-btn" onClick={toggleClassDropdown}>
            Select Class Number
          </button>

          {isClassDropdownOpen && (
            <div className="dropdown-menu">
                <p>Select Class Number</p>
                <ul>
                    {[1, 2, 3].map((num) => (
                    <li
                        key={num}
                        onClick={() => {
                          setSelectedClass(num);
                          setIsClassDropdownOpen(false);
                        }}
                        className="dropdown-item"
                    >
                        {num}
                    </li>
                    ))}
                </ul>
            </div>
          )}
        </div>
      )}
        {selectedClass && (
            <div className="selected-box">
                <h3>{selectedClass}</h3>
            </div>
        )}
      { selectedUser && selectedClass && (
        <button className="btn btn-sm" onClick={Assign}>
          <h3>Assign</h3>
        </button>
      )}
    </div>
  </div>  
  );
}

export default Teacher;
