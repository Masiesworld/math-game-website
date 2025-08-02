import { useEffect, useState } from 'react';
import '../App.css';
console.log("leaderboards called");
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
    console.log("users is:");
    console.log(users);
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
    console.log("A");
    console.log(A);
    console.log("B");
    console.log(B);
    // Sort in ascending order
    while (true) {
        if (A[i]["total_score"] <= B[j]["total_score"]) {
            console.log("A pushed");
            C.push(A[i]);
            i++;
        }
        
        else if (A[i]["total_score"] > B[j]["total_score"]) {
            console.log("B pushed");
            C.push(B[j]);
            j++;
        }
        
        if (i >= A.length) {
            console.log("All of A inserted; insert the rest of B now");
            for (let k = j; k < B.length; k++)
                C.push(B[k]);
            break;
        }
        
        else if (j >= B.length) {
            console.log("All of B inserted; insert the rest of A now");
            for (let k = i; k < A.length; k++)
                C.push(A[k]);
            break;
        }
    }
    
    return C;
}

async function getUsers() {
  console.log("getUsers called");
  try {
    const response = await fetch('http://localhost:3001/users', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    console.log("after the await");
    const data = await response.json();
    console.log("after the data; data is: ");
    console.log(data);
    return data;
    if (response.ok) {
      return data;
    }
    else {
      return "";
    }
  } catch (error) {
    console.error('Login error:', error);
  }
}

let sortedUsersDescending = sortUsersByScoreDescending(await getUsers());

console.log(sortedUsersDescending);

function Leaderboards() {
    const [users, setUsers] = useState(sortedUsersDescending);
    const [isRefreshing, indicateRefreshing] = useState(0);

    async function refreshUsers() {
        console.log("refreshUsers called");

        let sortedUsersDescending = sortUsersByScoreDescending(await getUsers()); 
        console.log(sortedUsersDescending);
        setUsers(sortedUsersDescending);

        console.log("refreshUsers returning");
    }

    function bro() {
        if (isRefreshing > 0) {
            console.log("refreshes already taking place... returning...");
            return;
        }

        indicateRefreshing(1);
        console.log("this is the first refresh");

        setInterval(refreshUsers, 10000);
    }
    
    let userRankings = users.map(user =>
        <li key={user._id} id="rank">{user.username} | {user.total_score}</li>);
    
    return (
        <div id="leaderboards">
            <h2>LEADERBOARD</h2>            
            <ol id="user-rankings">{userRankings}</ol>
            {console.log("USER RANKINGS")}
            {console.log(userRankings)}
            {bro()}
        </div>
    );
}

export default Leaderboards;