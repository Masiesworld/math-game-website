import { useState } from 'react';
import '../App.css';

// removed debug log

// Merge Sort (Ascending Order)
function sortUsersByScoreAscending(users) {
    if (users.length <= 1)
        return users;
    
    let middle = Math.floor(users.length / 2);
    let leftHalf = users.slice(0, middle);
    let rightHalf = users.slice(middle, users.length);

    let A = sortUsersByScoreAscending(leftHalf);
    let B = sortUsersByScoreAscending(rightHalf);

    let L = merge(A, B);
    return L;
}

// Merge Sort (Descending Order)
function sortUsersByScoreDescending(users) {
    // removed debug logs

    // Get the sorted result in ascending order
    let L = sortUsersByScoreAscending(users);
    
    // Reverse to descending order
    let LReverse = [];
    for (let i = L.length - 1; i >= 0; i--)
        LReverse.push(L[i]);
    
    return LReverse;
}

// Merge step in Merge Sort
function merge(A, B) {
    let C = [];
    let i = 0;
    let j = 0;

    // removed debug logs

    // Sort in ascending order
    while (true) {
        if (A[i]["total_score"] <= B[j]["total_score"]) {
            // debug log removed
            C.push(A[i]);
            i++;
        }
        
        else if (A[i]["total_score"] > B[j]["total_score"]) {
            // debug log removed
            C.push(B[j]);
            j++;
        }
        
        if (i >= A.length) {
            // debug log removed
            for (let k = j; k < B.length; k++)
                C.push(B[k]);
            break;
        }
        
        else if (j >= B.length) {
            // debug log removed
            for (let k = i; k < A.length; k++)
                C.push(A[k]);
            break;
        }
    }
    
    return C;
}

// Get the users from the database
async function getUsers() {
  try {
    const response = await fetch('http://localhost:3001/users', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();

    // Filter only students
    return data.filter(user => user.role === 'student');
  } catch (error) {
    console.error('Login error:', error);
    return [];
  }
}

// Get the users from the database, and sort them in descending order
let sortedUsersDescending = sortUsersByScoreDescending(await getUsers());

// debug log removed

function Leaderboards() {
    const [users, setUsers] = useState(sortedUsersDescending);
    const [isRefreshing, indicateRefreshing] = useState(0);

    // Get the users from the database again. This way, we can get any changes in the user score and update the leaderboards
    async function refreshUsers() {
        // debug log removed

        let sortedUsersDescending = sortUsersByScoreDescending(await getUsers()); 
        // debug log removed
        setUsers(sortedUsersDescending);

        // debug log removed
    }

    // Ideally, this should be called once to update the leaderboards every 10 seconds
    function refreshLeaderboards() {
        if (isRefreshing > 0) {
            // debug log removed
            return;
        }

        indicateRefreshing(1);
        // debug log removed

        setInterval(refreshUsers, 10000);
    }
    
    // Display the list of users ranked by their score in descending order
    let rank = 1;
    let userRankings = users.map(user =>
        <li key={user._id} id="rank">
            {rank++}. {user.username} | {user.total_score}
            <img src={user.avatar || "/cat.png"} className="leaderboard-avatar" alt="Avatar" />
        </li>);
    
    return (
        <div id="leaderboards">
            <h2>LEADERBOARD</h2>            
            <ol id="user-rankings">{userRankings}</ol>
            {/* debug logs removed */}

            {/* being refreshing the leaderboards ever 10 seconds */}
            {refreshLeaderboards()}
        </div>
    );
}

export default Leaderboards;