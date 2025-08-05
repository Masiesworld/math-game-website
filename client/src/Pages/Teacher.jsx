import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css'
import './Teacher.css'

// A Teacher Page for teachers to assign students to classrooms, lookup students, and add questions
function Teacher() {
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
    const [isLookupDropdownOpen, setIsLookupDropdownOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const classButtonRef = useRef();
    const studentButtonRef = useRef();
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedLookupUser, setSelectedLookupUser] = useState(null);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [incorrects, setIncorrects] = useState(['', '', '']);
    const [difficulty, setDifficulty] = useState(null);

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
                  toast.success('Class Number Assigned Successfully!');
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

    const toggleLookupUserDropdown = () => {
    setIsLookupDropdownOpen(prev => !prev);
    };

  // Fetch users from backend on component mount
  useEffect(() => {
    fetch('http://localhost:3001/admin/users') // adjust if needed
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error('Error fetching users:', err));
  }, []);

  return (
    <div>
    <div className="box-main">
      <div className="teacher-block">
        <h1 className = "header-title">Teacher Page</h1>
        
        <div className="side-by-side-container">
          <div className="assign-section">
            <h2 className="section-title">Assign Class Number</h2>
            <div className="dropdown-wrapper">
              <button ref={classButtonRef} className="teach-btn" onClick={toggleUserDropdown}>
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
              <button ref={classButtonRef} className="teach-btn" onClick={toggleClassDropdown}>
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
        <div className="questions-section">
          <h2 className="section-title">Add Questions</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();

              if (!question || !answer || incorrects.some(ans => !ans) || !difficulty) {
                alert('Please fill in all fields including difficulty.');
                return;
              }

              try {
                const res = await fetch('http://localhost:3001/admin/add-question', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    question,
                    answer: Number(answer),
                    incorrects: incorrects.map(val => Number(val)),
                    difficulty
                  })
                });

                if (res.ok) {
                  const data = await res.json();
                  toast.success('Question added successfully!');
                  setTimeout(() => {
                  window.location.reload(); // Full page reload to implement question into game window
                  }, 4000); // 4 second delay
                } else {
                  const error = await res.text();
                  alert('Error adding question: ' + error);
                }
              } catch (err) {
                console.error('Add question error:', err);
                alert('An error occurred while adding the question.');
              }
            }}
          >

            <input
              type="text"
              placeholder="Enter Question"
              className="question-input"
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter Correct Answer"
              className="question-input"
              required
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <div className="incorrect-answers-group">
              {incorrects.map((val, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Incorrect Answer ${index + 1}`}
                  className="incorrect-input"
                  required
                  value={val}
                  onChange={(e) => {
                    const newIncorrects = [...incorrects];
                    newIncorrects[index] = e.target.value;
                    setIncorrects(newIncorrects);
                  }}
                />
              ))}
            </div>
            <div className="difficulty-buttons">
              {['Easy', 'Medium', 'Hard'].map((level) => (
                <button
                  type="button"
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`difficulty-btn ${difficulty === level ? 'selected' : ''}`}
                >
                  {level}
                </button>
              ))}
            </div>
            <button type="submit" className="btn btn-sm">Add</button>
          </form>
        </div>
        <div className="student-lookup-section">
          <h2 className="section-title">Student Lookup</h2>
          <div className="dropdown-wrapper">
              <button ref={studentButtonRef} className="teach-btn" onClick={toggleLookupUserDropdown}>
                Select Student
              </button>
              {isLookupDropdownOpen && (
              <div className="dropdown-menu">
                <p>Select Student</p>
                  <ul>
                    {users
                    .filter(user => user.role === "student")
                    .map((user, index) => (
                   <li key={index}
                    onClick={async() => {
                  try {
                    const res = await fetch(`http://localhost:3001/admin/users/${user.username}`);
                    if (!res.ok) throw new Error('Failed to fetch user');
                    const data = await res.json();
                    setSelectedLookupUser(data);
                    setIsLookupDropdownOpen(false);
                  } 
                  catch (err) {
                    console.error('User fetch error:', err);
                    alert('Could not load user data');
                  }
                  }}
                  className="dropdown-item"
                  >
                  {user.username}
                  </li>
              ))}
          </ul>
          </div>
        )}
          </div>
           {selectedLookupUser && (
              <div className="student-details">
                <h3>Student Details</h3>
                <p><strong>Username:</strong> {selectedLookupUser.username}</p>
                <p><strong>Email:</strong> {selectedLookupUser.email}</p>
                <p><strong>Class Number:</strong> {selectedLookupUser.class_number}</p>
                <p><strong>High Score:</strong> {selectedLookupUser.total_score}</p>
              </div>
          )}
        </div>
      </div>
    </div>
  </div>
      <ToastContainer />
    </div> 
  );
}
export default Teacher;
