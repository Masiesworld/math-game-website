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

async function getQuestions() {
  console.log("get questions called");
  try {
    const response = await fetch('http://localhost:3001/questions', {
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

function loadQuestion(questions, previous_question) {
  console.log(questions);

  let numQuestions = questions.length;
  let chosen = 0;
  while (true) {
    var randomIndex = Math.floor(Math.random() * numQuestions);
    if (questions[randomIndex]["question"] != previous_question)
      chosen = questions[randomIndex];
      break;
  }

  return [chosen["question"], chosen["answer"]];
}

let initialized_questions = await getQuestions();

function Home() {
  const [message, setMessage] = useState('Loading...');
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState(0);
  const [prevQuestion, setPrev] = useState("");
  
  function CheckAnswer(isCorrect, question) {
    if (isCorrect) {
      console.log(`score set to ${score}`)
      setScore(score + 10);
    }
    
    // The answer choices should randomize in order as long as some state is being changed??
    setQuestions(questions + 1);
    setPrev(question);
  }

  let test = loadQuestion(initialized_questions, prevQuestion);
  let questionTitle = test[0];
  let questionAnswer = test[1];
  console.log("GOOD MORNING" + test);

  let answerChoices = [];
  answerChoices.push(<AnswerChoice id={1} choice={questionAnswer} onClick={function(){CheckAnswer(1)}}/>);
  answerChoices.push(<AnswerChoice id={2} choice={questionAnswer + 1} onClick={function(){CheckAnswer(0)}}/>);
  answerChoices.push(<AnswerChoice id={3} choice={questionAnswer + 2} onClick={function(){CheckAnswer(0)}}/>);
  answerChoices.push(<AnswerChoice id={4} choice={questionAnswer - 1} onClick={function(){CheckAnswer(0)}}/>);

  answerChoices = RandomizeAnswerChoices(answerChoices);
  console.log(answerChoices);

  useEffect(() => {
    fetch('http://localhost:3001/api/test') // Your Express route
    .then(res => res.json())
    .then(data => setMessage(data.message))
    .catch(err => {
      console.error('Error fetching from backend:', err);
      setMessage('Error connecting to backend');
    });
  }, []);

  return (
    <div>
      <div className="box-main">
        <h1>Placeholder for Leaderboard?</h1>
        <div id="game-window">
          <h1 id="score">Score: {score}</h1>
          <h1 id="question">{questionTitle}</h1>
          {answerChoices}
        </div>
        <h2>{message}</h2>
      </div>
    </div>
  );
}

// When the website loads...
initQuestions();
initUsers();

export default Home;

// <h1>Placeholder where game window will go?</h1>