import { useEffect } from 'react';
import '../App.css';

// A function to dispatch an event to indicate that the user has chosen a specific difficulty
function dispatchDifficulty(difficulty) {
  // Get the difficulty buttons
  let all = document.getElementById("all-difficulty");
  let easy = document.getElementById("easy-difficulty");
  let medium = document.getElementById("medium-difficulty");
  let hard = document.getElementById("hard-difficulty");
  let buttons = [all, easy, medium, hard];
  let selectedButton = 0;

  // Set the difficulty in local storage
  localStorage.setItem("difficulty", difficulty);
  
  // Check for the inputted difficulty
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
      // Change the selected difficulty button's color to green
      buttons[i].style.backgroundColor = "#2ece43";
      continue;
    }
    else {
      // Change the rest of the difficulty buttons' colors to green
      buttons[i].style.backgroundColor = "lightgray";
    }
  }
}

// A component to display a starting window, allowing the user to choose when the start the Math game and the difficulty they would like
function StartingWindow() {
  // Difficulty buttons
  let allButton = <button className="btn btn-sm play difficulty-button" id="all-difficulty" onClick={function(){dispatchDifficulty("all");}}>ALL</button>
  let easyButton = <button className="btn btn-sm play difficulty-button" id="easy-difficulty" onClick={function(){dispatchDifficulty("easy");}}>EASY</button>
  let mediumButton = <button className="btn btn-sm play difficulty-button" id="medium-difficulty" onClick={function(){dispatchDifficulty("medium");}}>MEDIUM</button>
  let hardButton = <button className="btn btn-sm play difficulty-button" id="hard-difficulty" onClick={function(){dispatchDifficulty("hard");}}>HARD</button>

  useEffect(() => {
    // Highlight the current selected difficulty button green
    dispatchDifficulty(localStorage.getItem("difficulty"));
  }, []);

  return (
    <div>
        <div id="game-window">
          {/* add the user's avatar and username */}
          <img src={localStorage.getItem("avatar") || "/cat.png"} alt="Avatar" className="avatar" />
          <h1 id="Userinfo">{localStorage.getItem("username") || "Guest"}</h1>

          <div id="inner-window">
            {/* button to start the game */}
            <button className="btn btn-sm play" id="start-game-button" onClick={function(){window.dispatchEvent(new Event("Game Start!"));}}>Start Game</button>

            {/* difficulty buttons */}
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

export { StartingWindow }