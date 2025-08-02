import { useEffect, useState, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import '../App.css';

function dispatchDifficulty(difficulty) {
  let all = document.getElementById("all-difficulty");
  let easy = document.getElementById("easy-difficulty");
  let medium = document.getElementById("medium-difficulty");
  let hard = document.getElementById("hard-difficulty");
  let buttons = [all, easy, medium, hard];
  let selectedButton = 0;

  localStorage.setItem("difficulty", difficulty);
  
  switch(difficulty) {
    case "all":
      selectedButton = 0;
      window.dispatchEvent(new Event("All Difficulty!"));
      break;
    case "easy":
      selectedButton = 1;
      window.dispatchEvent(new Event("Easy Difficulty!"));
      break;
    case "medium":
      selectedButton = 2;
      window.dispatchEvent(new Event("Medium Difficulty!"));
      break;
    case "hard":
      selectedButton = 3;
      window.dispatchEvent(new Event("Hard Difficulty!"));
      break;
    default:
      // Failed to dispatch difficulty
  }

  for (let i = 0; i < buttons.length; i++) {
    if (i == selectedButton) {
      buttons[i].style.backgroundColor = "#2ece43";
      continue;
    }
    else {
      buttons[i].style.backgroundColor = "lightgray";
    }
  }
}

function StartingWindow() {
  let allButton = <button className="btn btn-sm play difficulty-button" id="all-difficulty" onClick={function(){dispatchDifficulty("all");}}>ALL</button>
  let easyButton = <button className="btn btn-sm play difficulty-button" id="easy-difficulty" onClick={function(){dispatchDifficulty("easy");}}>EASY</button>
  let mediumButton = <button className="btn btn-sm play difficulty-button" id="medium-difficulty" onClick={function(){dispatchDifficulty("medium");}}>MEDIUM</button>
  let hardButton = <button className="btn btn-sm play difficulty-button" id="hard-difficulty" onClick={function(){dispatchDifficulty("hard");}}>HARD</button>

  useEffect(() => {
    dispatchDifficulty(localStorage.getItem("difficulty"));
  }, []);

  return (
    <div>
        <div id="game-window">
          <img src={localStorage.getItem("avatar") || "/cat.png"} alt="Avatar" className="avatar" />
          <h1 id="Userinfo">{localStorage.getItem("username") || "Guest"}</h1>
          <div id="inner-window">
            <button className="btn btn-sm play" id="start-game-button" onClick={function(){window.dispatchEvent(new Event("Game Start!"));}}>Start Game</button>
            <h2 id="select-difficulty-text">Select Difficulty:</h2>
              {allButton}
              {easyButton}
              {mediumButton}
              {hardButton}
          </div>
        </div>
    </div>
  );
}

// export default StartingWindow;
export { StartingWindow }