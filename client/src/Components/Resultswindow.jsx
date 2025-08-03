import { useEffect, useState } from 'react';
import '../App.css';

// Resultswindow.jsx loaded

function ResultsWindow({ score, questionsAnswered, questionsCorrect }) {
    const [test, setTest] = useState(0);

    async function updateUserScore(points) {

        // Update the user's score in the backend
        try {
            const response = await fetch('http://localhost:3001/users/update-score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({username: localStorage.getItem("username"), score_increase: points})
            });
            
            const data = await response.json();
        } catch (error) {
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
                <img src={localStorage.getItem("avatar") || "/cat.png"} alt="Avatar" className="avatar" />
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