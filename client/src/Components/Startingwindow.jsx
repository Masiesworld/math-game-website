import { useEffect, useState, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import '../App.css';

function dispatchDifficulty(difficulty) {
  switch(difficulty) {
    case "all":
      window.dispatchEvent(new Event("All Difficulty!"));
      break;
    case "easy":
      window.dispatchEvent(new Event("Easy Difficulty!"));
      break;
    case "medium":
      window.dispatchEvent(new Event("Medium Difficulty!"));
      break;
    case "hard":
      window.dispatchEvent(new Event("Hard Difficulty!"));
      break;
    default:
      console.log("Failed to dispatch difficulty");
  }
}

function StartingWindow() {
  return (
    <div>
        <div id="game-window">
          <h1 id="Userinfo">{localStorage.getItem("username") || "Guest"}</h1>
          <div id="inner-window">
            <button className="btn btn-sm play" id="start-game-button" onClick={function(){window.dispatchEvent(new Event("Game Start!"));}}>Start Game</button>
            <h2 id="select-difficulty-text">Select Difficulty:</h2>
            <button className="btn btn-sm play difficulty-button" id="all-difficulty" onClick={function(){dispatchDifficulty("all");}}>ALL</button>
            <button className="btn btn-sm play difficulty-button" id="easy-difficulty" onClick={function(){dispatchDifficulty("easy");}}>EASY</button>
            <button className="btn btn-sm play difficulty-button" id="medium-difficulty" onClick={function(){dispatchDifficulty("medium");}}>MEDIUM</button>
            <button className="btn btn-sm play difficulty-button" id="hard-difficulty" onClick={function(){dispatchDifficulty("hard");}}>HARD</button>
          </div>
        </div>
    </div>
  );
}

// export default StartingWindow;
export { StartingWindow }