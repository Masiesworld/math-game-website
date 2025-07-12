import { useEffect, useState } from 'react';
import '../App.css';

function AnswerChoice({ id, choice, onClick }) {
  return (
    <button onClick={onClick} className="answer-choice">
      {choice}
    </button>
  );
}

function RandomizeAnswerChoices(answerChoices) {
  let randomized = []
  for(let i = answerChoices.length; i > 0; i--) {
    var randomIndex = Math.floor(Math.random() * i);
    randomized.push(answerChoices.splice(randomIndex, 1));
  }

  return randomized;
}

async function initQuestions() {
  console.log("INITIALIZE QUESTIONS");
  try {
    const response = await fetch('http://localhost:3001/questions/initialize-questions', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    console.log("after the await");
    const data = await response.json();
    console.log("after the data; data is: ");
    console.log(data);
    if (response.ok) {
      setMessage(data.message || `Insert ${data.length} questions`);
    }
    else {
      setMessage(data.error || 'Error fetching questions');
    }
  } catch (error) {
    console.error('Login error:', error);
    setMessage('Error connecting to backend');
  }
}

async function initUsers() {
  console.log("INITIALIZE USERS");
  try {
    const response = await fetch('http://localhost:3001/users/initialize-users', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    console.log("after the await");
    const data = await response.json();
    console.log("after the data; data is: ");
    console.log(data);
    if (response.ok) {
      setMessage(data.message);
    }
    else {
      setMessage(data.error);
    }
  } catch (error) {
    console.error('Login error:', error);
    setMessage('Error connecting to backend');
  }
}

function Home() {
  let answerChoices = [<AnswerChoice id={1} choice={"CORRECT"} onClick={function(){CheckAnswer(1);}}/>,
                       <AnswerChoice id={2} choice={"INCORRECT"} onClick={function(){CheckAnswer(0);}}/>,
                       <AnswerChoice id={3} choice={"INCORRECT"} onClick={function(){CheckAnswer(0);}}/>,
                       <AnswerChoice id={4} choice={"INCORRECT"} onClick={function(){CheckAnswer(0);}}/>];
  answerChoices = RandomizeAnswerChoices(answerChoices);
  
  const [message, setMessage] = useState('Loading...');
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState(0);

  const [a, setA] = useState("");
  const [b, setB] = useState("");

  useEffect(() => {
    fetch('http://localhost:3001/api/test') // Your Express route
    .then(res => res.json())
    .then(data => setMessage(data.message))
    .catch(err => {
      console.error('Error fetching from backend:', err);
      setMessage('Error connecting to backend');
    });
  }, []);
  
  function CheckAnswer(isCorrect) {
    if (isCorrect) {
      console.log(`score set to ${score}`)
      setScore(score + 10);
    }
    
    // The answer choices should randomize in order as long as some state is being changed??
    setQuestions(questions + 1);
  }

  async function getQuestions() {
    console.log("called");
    try {
      const response = await fetch('http://localhost:3001/questions', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      console.log("after the await");
      const data = await response.json();
      console.log("after the data; data is: ");
      console.log(data);
      if (response.ok) {
        setMessage(data.message);
      }
      else {
        setMessage(data.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Error connecting to backend');
    }
  }

  return (
    <div>
      <div className="box-main">
        <h1>Placeholder for Leaderboard?</h1>
        <h1>Placeholder where game window will go?</h1>
        <div id="game-window">
          <h1 id="score">Score: {score}</h1>
          <h1 id="question">QUESTION</h1>
          {answerChoices}
          <button onClick={function(){getQuestions()}}>GET QUESTIONS</button>
        </div>
        <h2>{message}</h2>
      </div>
    </div>
  );
}

initQuestions();
initUsers();
export default Home;