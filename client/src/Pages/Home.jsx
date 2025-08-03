import { useEffect, useState, lazy, Suspense, useRef } from 'react';
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
  // initializeLocalStorage called (debug log removed)

  const username = localStorage.getItem("username") || "";
  // username logged (debug removed)
  if (username == "") {
    // initializing local storage user...
    localStorage.setItem("username", "");
  }

  const difficulty = localStorage.getItem("difficulty") || "";
  // difficulty logged (debug removed)
  if (difficulty == "") {
    // initializing local storage difficulty...
    localStorage.setItem("difficulty", "all"); 
  }

  const passwordResetEmail = localStorage.getItem("passwordResetEmail") || "";
  // passwordResetEmail logged (debug removed)
  if (passwordResetEmail == "") {
    // initializing local storage passwordResetEmail...
    localStorage.setItem("passwordResetEmail", "");
  }
  
  const avatar = localStorage.getItem("avatar") || "";
  // avatar logged (debug removed)
  if (avatar == "") {
    // initializing local storage avatar...
    localStorage.setItem("avatar", "/cat.png");
  }
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
  // removed debug logs for questions and previous question

  let numQuestions = questions.length;
  let chosen = 0;

  while (true) {
    var randomIndex = Math.floor(Math.random() * numQuestions);
    if (questions[randomIndex]["question"] == previous_question) {
      // duplicate question skipped
    }
    else if ((questions[randomIndex]["difficulty"] != difficulty) && (difficulty != "All")) {
      // question not of chosen difficulty skipped
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

  /* --- Audio refs for music --- */
  const gameAudioRef = useRef(null);
  const endAudioRef  = useRef(null);

  function selectAllDifficulty() {
    // switched to All difficulty
    setDifficulty("All");
  }
  
  function selectEasyDifficulty() {
    // switched to Easy difficulty
    setDifficulty("Easy");
  }
  
  function selectMediumDifficulty() {
    // switched to Medium difficulty
    setDifficulty("Medium");
  }
  
  function selectHardDifficulty() {
    // switched to Hard difficulty
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

  /* Handle game music based on gamestate changes. */
  useEffect(() => {
    // Helper to safely stop and clear an audio ref
    const stopAudio = (audioRef) => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };

    if (gamestate === "play") {
      // Stop any previous end jingle
      stopAudio(endAudioRef);

      // start and restart background music
      stopAudio(gameAudioRef);
      const bg = new Audio('/music/enemy-course.flac');
      bg.loop = true;
      bg.volume = 0.6;
      bg.play().catch(() => {/* autoplay might be blocked */});
      gameAudioRef.current = bg;
    } else if (gamestate === "finish") {
      // Stop background music
      stopAudio(gameAudioRef);

      // Play 1-shot end music
      stopAudio(endAudioRef);
      const fanfare = new Audio('/music/enemy-course-fanfare.flac');
      fanfare.volume = 0.8;
      fanfare.play().catch(() => {});
      endAudioRef.current = fanfare;
    } else {
      // "start" or any other state: ensure no music is playing
      stopAudio(gameAudioRef);
      stopAudio(endAudioRef);
    }

    // Cleanup on component unmount
    return () => {
      stopAudio(gameAudioRef);
      stopAudio(endAudioRef);
    };
  }, [gamestate]);

  async function CheckAnswer(isCorrect, question, points) {
    if (isCorrect) {
      // Update the number of questions the user has answered correct
      setQuestionsCorrect(questionsCorrect + 1);

      // Update the user's score in the frontend
      // score updated
      setScore(score + points);
    }
    
    setQuestionsAnswered(questionsAnswered + 1);

    // The answer choices should randomize in order as long as some state is being changed??
    setPrev(question);
    // prev question updated
  }

  let questionInfo = loadQuestion(questions, prevQuestion, difficulty);
  // let questionInfo = ["asdf", "asdf", ["asdf", "asdf", "asdf"]];
  let questionTitle = questionInfo[0];
  let questionAnswer = questionInfo[1];
  let incorrectAnswers = questionInfo[2];
  // questionInfo debug removed

  let answerChoices = [];
  answerChoices.push(<AnswerChoice id={1} choice={questionAnswer} onClick={function(){CheckAnswer(1, questionTitle, 10)}}/>);
  answerChoices.push(<AnswerChoice id={2} choice={incorrectAnswers[0]} onClick={function(){CheckAnswer(0, questionTitle, 10)}}/>);
  answerChoices.push(<AnswerChoice id={3} choice={incorrectAnswers[1]} onClick={function(){CheckAnswer(0, questionTitle, 10)}}/>);
  answerChoices.push(<AnswerChoice id={4} choice={incorrectAnswers[2]} onClick={function(){CheckAnswer(0, questionTitle, 10)}}/>);
  
  answerChoices = RandomizeAnswerChoices(answerChoices);
  // answerChoices debug removed

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
        {/* debug removed */}
        <Suspense>
          <Leaderboards />
        </Suspense>
        {gamestate == "play" ? (
          <div id="game-window">
            <img src={localStorage.getItem("avatar") || "/cat.png"} alt="Avatar" className="avatar" />
            <h1 id="Userinfo">
            <span>{localStorage.getItem("username") || "Guest"}</span>
            </h1>
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