import { useEffect, useState, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import '../App.css';

console.log("Resultswindow.jsx called");

function ResultsWindow({ score, questionsAnswered, questionsCorrect }) {
    const [test, setTest] = useState(0);

    async function updateUserScore(points) {
        console.log("updateUserScore called");

        // Update the user's score in the backend
        try {
            const response = await fetch('http://localhost:3001/users/update-score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({username: localStorage.getItem("username"), score_increase: points})
            });
            
            const data = await response.json();
            // if (response.ok) {
            //     setMessage(data.message);
            // } 
            // else {
            //     setMessage(data.error);
            // }
        } catch (error) {
            console.error('Login error:', error);
            setMessage('Error connecting to backend');
        }
    }

    useEffect(() => {
        // Update the user's points as early as we are able to
        // score / 2 because it's called twice??
        updateUserScore(score / 2);
    }, []);


    return (
        <div>
            <div id="game-window">
                <h1 id="Userinfo">{localStorage.getItem("username") || "Guest"}</h1>

                <button id="restart-game-button" onClick={function(){window.dispatchEvent(new Event("Game Restart!"));}}>Restart Game</button>
                <h1>Score: {score}</h1>
                <h1>Questions Correct: {questionsCorrect}</h1>
                <h1>Questions Answered: {questionsAnswered}</h1>
            </div>
        </div>
    );
}

// export default ResultsWindow;
export { ResultsWindow }