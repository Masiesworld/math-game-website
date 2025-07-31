import { useEffect, useState, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import '../App.css';


function StartingWindow() {
  return (
    <div>
      <div className="box-main">
        <div id="game-window">
          <h1 id="Userinfo">{localStorage.getItem("username") || "Guest"}</h1>

          <button onClick={function(){window.dispatchEvent(new Event("Game Start!"));}}>Start Game</button>
        </div>
      </div>
    </div>
  );
}

export default StartingWindow;