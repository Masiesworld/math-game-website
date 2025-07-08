import { useEffect, useState } from 'react';
import '../App.css';

function Home() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    fetch('http://localhost:5000/api/test') // Your Express route
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
        <h1>Placeholder for Leaderboard?</h1>
        <h1>Placeholder where game window will go?</h1>
         <h2>{message}</h2>
      </div>
    </div>
  );
}

export default Home;
