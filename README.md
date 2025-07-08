# math-game-website

Class project for CEN 3031.
A math game website that is fun and engaging for a general audience who enjoys math. It’s attended for all ages who can do basic math such as addition, subtraction, multiplication, and division. With teacher and student accounts, featuring a leaderboard.

## Features
- Responsive UI
- Math game with score tracking
- Leaderboard

## Tech Stack
- Frontend: React.js (TBD)
- Backend: Node.js + Express.js (TBD)
- Database: MySQL (TBD)
- Project management: Jiro/Trello (TBD)

## Instructions for MongoDB and Backend implementation
1. Install MongoDB -> https://www.mongodb.com/try/download/community
    - current version as of writing this is 8.0.11
2. cd server -> npm install
3. create a .env file and paste the following information below:
    MONGO_URI=mongodb://127.0.0.1:27017/my-math-game
    PORT=5000
4. Start MongoDB locally:
    For Windows: Open a separate command prompt -> "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe"
        - can double-check in file explorer if the path above exists
    For Mac: Open a separate terminal -> mongod
5. From the server directory -> npm run dev
