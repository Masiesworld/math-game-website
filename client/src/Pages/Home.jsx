import { useEffect, useState, lazy, Suspense, useRef } from 'react';
import '../App.css';
import '../Components/Leaderboards.css';
import '../Components/Gamewindow.css';
import '../Components/Timer.css';
import '../Components/Startingwindow.css';
import '../Components/Resultswindow.css';
const Leaderboards = lazy(() => import('../Components/Leaderboards.jsx')); // "wait" to load this
import { Timer } from '../Components/Timer.jsx';
import { TimeBonus } from '../Components/TimeBonus.jsx';
import { StartingWindow } from '../Components/Startingwindow.jsx';
import { ResultsWindow } from '../Components/Resultswindow.jsx';

// Initialize the local storage
function initializeLocalStorage() {removeEventListener
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

  const classroom = localStorage.getItem("classroom") || "";
  // classroom logged (debug removed)
  if (classroom == "") {
    // initializing local storage classroom...
    localStorage.setItem("classroom", null);
  }

  const time_bonus = localStorage.getItem("time_bonus") || "";
  // time_bonus logged (debug removed)
  if (time_bonus == "") {
    // initializing local storage time_bonus...
    localStorage.setItem("time_bonus", 5);
  }
}

// Call initializeLocalStorage early (ideally)
initializeLocalStorage();

// Answer choice buttons
function AnswerChoice({ id, choice, onClick }) {
  return (
    <button onClick={onClick} className="answer-choice">
      {choice}
    </button>
  );
}

/* Randomize the order of the answer choice buttons by storing the buttons in an array,
   and then randomizing their order in the array to be used later */
function RandomizeAnswerChoices(answerChoices) {
  let randomized = []
  for(let i = answerChoices.length; i > 0; i--) {
    // Take a random element in answerChoices, push that to randomized, and remove it from answerChoices
    var randomIndex = Math.floor(Math.random() * i);
    randomized.push(answerChoices.splice(randomIndex, 1));
  }

  return randomized;
}

// Chooses a question (of specified difficulty) from the database of questions
function loadQuestion(questions, previous_question, difficulty) {
  // removed debug logs for questions and previous question

  let numQuestions = questions.length;
  let chosen = 0;

  while (true) {
    var randomIndex = Math.floor(Math.random() * numQuestions);
    if (questions[randomIndex]["question"] == previous_question) {
      // duplicate question skipped (debug log removed)
    }
    else if ((questions[randomIndex]["difficulty"] != difficulty) && (difficulty != "All")) {
      // question not of chosen difficulty skipped (debug log removed)
    }
    else {
      chosen = questions[randomIndex];
      break;
    }
  }
  
  // Return the question information
  return [chosen["question"], chosen["answer"], chosen["incorrects"]];
}

// Home Page receives the questions from the database in the form of the questions variable
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
    // switched game state to "play" and begin the time bonus timer
    window.dispatchEvent(new Event("New Question!"));
    setGameState("play");
  }

  function finishGame() {
    // switched game state to "finish"
    setGameState("finish");
  }

  function closeResultsWindow() {
    // switched game state to "start"
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

  // Function to check whether the answer option the user clicks is the correct answer option
  async function CheckAnswer(isCorrect, question, points) {
    if (isCorrect) {
      // Update the number of questions the user has answered correct
      setQuestionsCorrect(questionsCorrect + 1);

      // Update the user's score in the frontend
      // score updated (debug log removed)
      setScore(score + points + parseInt(localStorage.getItem("time_bonus")));
    }
    
    setQuestionsAnswered(questionsAnswered + 1);

    // The answer choices should randomize in order as long as some state is being changed??
    setPrev(question);
    // prev question updated (debug log removed)

    // Reset the time bonus
    window.dispatchEvent(new Event("New Question!"));
  }

  // Initialize the current question to be displayed
  let questionInfo = loadQuestion(questions, prevQuestion, difficulty);
  let questionTitle = questionInfo[0];
  let questionAnswer = questionInfo[1];
  let incorrectAnswers = questionInfo[2];
  // questionInfo debug removed

  /* Make the answer choice buttons and put them in answerChoices. One choice will be set to "correct" and display the correct answer,
     while the other three will be set to "incorrect" and display the incorrect answers */
  let answerChoices = [];
  answerChoices.push(<AnswerChoice id={1} choice={questionAnswer} onClick={function(){CheckAnswer(1, questionTitle, 10)}}/>);
  answerChoices.push(<AnswerChoice id={2} choice={incorrectAnswers[0]} onClick={function(){CheckAnswer(0, questionTitle, 10)}}/>);
  answerChoices.push(<AnswerChoice id={3} choice={incorrectAnswers[1]} onClick={function(){CheckAnswer(0, questionTitle, 10)}}/>);
  answerChoices.push(<AnswerChoice id={4} choice={incorrectAnswers[2]} onClick={function(){CheckAnswer(0, questionTitle, 10)}}/>);
  
  // Randomize the order of the answer choices
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
    
    // Event listeners for when events are dispatched by other pages or components
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
        {/* If the user is playing the game, show the game window */}
        {gamestate == "play" ? (
          <div id="game-window">
            <img src={localStorage.getItem("avatar") || "/cat.png"} alt="Avatar" className="avatar" />
            <h1 id="Userinfo">
            <span>{localStorage.getItem("username") || "Guest"}</span>
            </h1>
            <Timer />
            <TimeBonus />
            <h1 id="score">Score: {score}</h1>
              <div id="inner-window">
                <h1 id="question">{questionTitle}</h1>
                {answerChoices}
              </div>
          </div>
          ) : (
            <>
              {/* Otherwise, if the user just finished the game, show the results window */}
              {gamestate == "finish" ? (
                <ResultsWindow score={score} questionsAnswered={questionsAnswered} questionsCorrect={questionsCorrect} />
              ) : (
                <>
                  {/* Otherwise, the user has not yet started the game, show the starting window */}
                  <StartingWindow />
                </>
              )}
            </>
        )}
      </div>
    </div>
  );
}

export default Home;