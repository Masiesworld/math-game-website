import { useState } from 'react';
import "./App.css";

function App() {
  return (
    <div>
      <nav class="navbar background">
        <div class ="title">
            <h1>Math Trials</h1>
          </div>
        <ul class="nav-list">
          <li>
            <button class="btn btn-sm">
              Home
            </button>
          </li>
          <li>
            <button class="btn btn-sm">
              Profile
            </button>
          </li>
        </ul>
      </nav>
      <div class= "box-main">
        <h1>Placeholder for Leaderboard?</h1>
        <h1>Placeholder where game window will go?</h1>
      </div>
      <footer className="footer">
        <p className="text-footer">
          Made by: Macy Yu, Kyle Wostbrock, Rafael Hinchey, and Nicholas Lucky
        </p>
      </footer>
    </div>
  )
}

export default App
