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
                <div id="inner-window">
                    <button className="btn btn-sm play" onClick={function(){window.dispatchEvent(new Event("Game Restart!"));}}>Restart Game</button>
                    <h2>Score: {score}</h2>
                    <h2>Questions Correct: {questionsCorrect}</h2>
                    <h2>Questions Answered: {questionsAnswered}</h2>
                </div>
            </div>
        </div>
    );
}

// export default ResultsWindow;
export { ResultsWindow }