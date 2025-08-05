import { useEffect, useState, useRef } from 'react';

// Source: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback, delay) {
  const savedCallback = useRef();
 
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
 
  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

// A timer component for the game window
function Timer() {
    // A game round is set to last 60 seconds
    const [time, setTime] = useState(60);

    // Countdown function to count the time down
    function handleTime() {
      if (time > 0) {
        setTime((prevTime) => prevTime - 1);
      }
      else {
        window.dispatchEvent(new Event("Game Finish!"));
      }
    }

    // Begin the countdown
    const countdown = useInterval(handleTime, 1000);

    return (
      <>
        <div id="timer-area">
            <h1 id="countdown">{time}</h1>
        </div>
      </>
    );
}

export { Timer }