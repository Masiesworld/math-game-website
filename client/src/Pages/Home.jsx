import { useEffect, useState, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import '../App.css';
import '../Components/Leaderboards.css';
import '../Components/Gamewindow.css';
import '../Components/Timer.css';
import '../Components/Startingwindow.css';
import '../Components/Resultswindow.css';
const Leaderboards = lazy(() => import('../Components/Leaderboards.jsx'));
import { Timer } from '../Components/Timer.jsx';
import { StartingWindow } from '../Components/Startingwindow.jsx';
import { ResultsWindow } from '../Components/Resultswindow.jsx';

// Initialize the local storage
function initializeLocalStorage() {
  console.log("initializeLocalStorage called");

  const username = localStorage.getItem("username") || "";
  console.log(username);
  if (username != "") {
    console.log("local storage has already been initialized... returning...");
    return;
  }
  
  const difficulty = localStorage.getItem("difficulty") || "";
  console.log(difficulty);
  if (difficulty != "") {
    console.log("local storage has already been initialized... returning...");
    return;
  }

  console.log("initializing local storage...");
  localStorage.setItem("username", "");
  localStorage.setItem("difficulty", "all");
}
initializeLocalStorage();

// Answer choice buttons
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

function loadQuestion(questions, previous_question, difficulty) {
  console.log("QUESTIONS:");
  console.log(questions);
  console.log("previous_question");
  console.log(previous_question);

  let numQuestions = questions.length;
  let chosen = 0;

  while (true) {
    var randomIndex = Math.floor(Math.random() * numQuestions);
    if (questions[randomIndex]["question"] == previous_question) {
      console.log("DUPLICATE QUESTION... SKIPPING...");
    }
    else if ((questions[randomIndex]["difficulty"] != difficulty) && (difficulty != "All")) {
      console.log("QUESTION IS NOT OF CHOSEN DIFFICULTY... SKIPPING");
    }
    else {
      chosen = questions[randomIndex];
      break;
    }
  }
  
  return [chosen["question"], chosen["answer"], chosen["incorrects"]];
}

function Home({ questions, users }) {
  const [message, setMessage] = useState('Loading...');
  const [score, setScore] = useState(0);
  const [prevQuestion, setPrev] = useState("");
  const [gamestate, setGameState] = useState("start");
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [questionsCorrect, setQuestionsCorrect] = useState(0);
  const [difficulty, setDifficulty] = useState("All");

  function selectAllDifficulty() {
    console.log("Switched to All difficulty");
    setDifficulty("All");
  }
  
  function selectEasyDifficulty() {
    console.log("Switched to Easy difficulty");
    setDifficulty("Easy");
  }
  
  function selectMediumDifficulty() {
    console.log("Switched to Medium difficulty");
    setDifficulty("Medium");
  }
  
  function selectHardDifficulty() {
    console.log("Switched to Hard difficulty");
    setDifficulty("Hard");
  }

  function startGame() {
    setGameState("play");
  }

  function finishGame() {
    setGameState("finish");
  }

  function closeResultsWindow() {
    setGameState("start");

    // Reset Game Statistics
    setScore(0);
    setQuestionsAnswered(0);
    setQuestionsCorrect(0);
  }

  async function CheckAnswer(isCorrect, question, points) {
    if (isCorrect) {
      // Update the number of questions the user has answered correct
      setQuestionsCorrect(questionsCorrect + 1);

      // Update the user's score in the frontend
      console.log(`score set to ${score}`)
      setScore(score + points);
    }
    
    setQuestionsAnswered(questionsAnswered + 1);

    // The answer choices should randomize in order as long as some state is being changed??
    setPrev(question);
    console.log(`prev question set to ${prevQuestion}`);
  }

  let questionInfo = loadQuestion(questions, prevQuestion, difficulty);
  // let questionInfo = ["asdf", "asdf", ["asdf", "asdf", "asdf"]];
  let questionTitle = questionInfo[0];
  let questionAnswer = questionInfo[1];
  let incorrectAnswers = questionInfo[2];
  console.log("questionInfo is " + questionInfo);

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
    
    window.addEventListener("Game Start!", startGame);
    window.addEventListener("Game Finish!", finishGame);
    window.addEventListener("Game Restart!", closeResultsWindow);

    window.addEventListener("All Difficulty!", selectAllDifficulty);
    window.addEventListener("Easy Difficulty!", selectEasyDifficulty);
    window.addEventListener("Medium Difficulty!", selectMediumDifficulty);
    window.addEventListener("Hard Difficulty!", selectHardDifficulty);
  }, []);

  return (
    <div>
      <div className="box-main">
        {console.log("This is called inside of the box-main div")}
        <Suspense>
          <Leaderboards />
        </Suspense>
        {gamestate == "play" ? (
          <div id="game-window">
            <h1 id="Userinfo">{localStorage.getItem("username") || "Guest"}</h1>
            <Timer />
            <h1 id="score">Score: {score}</h1>
              <div id="inner-window">
                <h1 id="question">{questionTitle}</h1>
                {answerChoices}
              </div>
          </div>
          ) : (
            <>
              {gamestate == "finish" ? (
                <ResultsWindow score={score} questionsAnswered={questionsAnswered} questionsCorrect={questionsCorrect} />
              ) : (

                <StartingWindow />
              )}
            </>
        )}
      </div>
    </div>
  );
}

export default Home;

// <h1>Placeholder where game window will go?</h1>
// <h1>Placeholder for Leaderboard?</h1>