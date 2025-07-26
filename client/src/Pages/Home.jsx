import { useEffect, useState, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import '../App.css';
import '../Components/Leaderboards.css'
import '../Components/Gamewindow.css'
const Leaderboards = lazy(() => import('../Components/Leaderboards.jsx'));

// Initialize the local storage
function initializeLocalStorage() {
  console.log("initializeLocalStorage called");

  const username = localStorage.getItem("username") || "";
  console.log(username);
  if (username != "") {
    console.log("local storage has already been initialized... returning...");
    return;
  }

  console.log("initializing local storage...");
  localStorage.setItem("username", "");
}
initializeLocalStorage();

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

/*
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

    // Section shades out so can either needs to be fixed or removed
    /*
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
*/
function loadQuestion(questions, previous_question) {
  console.log("QUESTIONS:");
  console.log(questions);
  console.log("previous_question");
  console.log(previous_question);

  let numQuestions = questions.length;
  let chosen = 0;

  while (true) {
    var randomIndex = Math.floor(Math.random() * numQuestions);
    if (questions[randomIndex]["question"] != previous_question) {
      chosen = questions[randomIndex];
      break;
    }
    else {
      console.log("DUPLICATE QUESTION... SKIPPING...");
    }
  }
  
  return [chosen["question"], chosen["answer"], chosen["incorrects"]];
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

// Get the questions before 
// let initialized_questions = getQuestions();
// let initialized_users = getUsers();

function Home({ questions, users }) {
  const [message, setMessage] = useState('Loading...');
  const [score, setScore] = useState(0);
  //const [questions, setQuestions] = useState(0);
  const [prevQuestion, setPrev] = useState("");
  
  //console.log("on skibidi");
  async function CheckAnswer(isCorrect, question, points) {
    if (isCorrect) {
      // Update the user's score in the frontend
      console.log(`score set to ${score}`)
      setScore(score + points);
      
      // Update the user's score in the backend
      try {
        const response = await fetch('http://localhost:3001/users/update-score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({username: localStorage.getItem("username"), score_increase: points})
        });
        
        const data = await response.json();
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
    
    // The answer choices should randomize in order as long as some state is being changed??
    //setQuestions(questions + 1);
    setPrev(question);
    console.log(`prev question set to ${prevQuestion}`);
  }

  let questionInfo = loadQuestion(questions, prevQuestion);
  let questionTitle = questionInfo[0];
  let questionAnswer = questionInfo[1];
  let incorrectAnswers = questionInfo[2];
  console.log("GOOD MORNING" + questionInfo);

  let answerChoices = [];
  answerChoices.push(<AnswerChoice id={1} choice={questionAnswer} onClick={function(){CheckAnswer(1, questionTitle, 10)}}/>);
  answerChoices.push(<AnswerChoice id={2} choice={incorrectAnswers[0]} onClick={function(){CheckAnswer(0, questionTitle, 10)}}/>);
  answerChoices.push(<AnswerChoice id={3} choice={incorrectAnswers[1]} onClick={function(){CheckAnswer(0, questionTitle, 10)}}/>);
  answerChoices.push(<AnswerChoice id={4} choice={incorrectAnswers[2]} onClick={function(){CheckAnswer(0, questionTitle, 10)}}/>);
  
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
        {console.log("CALL ME ASPARAGUS")}
        <Suspense>
          <Leaderboards />
        </Suspense>
        <div id="game-window">
          <h1 id="Userinfo">{localStorage.getItem("username") || "Guest"}</h1>
          <h1 id="score">Score: {score}</h1>
            <div id="inner-window">
            <h1 id="question">{questionTitle}</h1>
            {answerChoices}
            </div>
        </div>
        <h2>{message}</h2>
      </div>
    </div>
  );
}

export default Home;

// <h1>Placeholder where game window will go?</h1>
// <h1>Placeholder for Leaderboard?</h1>