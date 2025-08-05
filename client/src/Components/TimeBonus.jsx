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

// A component to track the time bonus that a user can receive for a question at a given time
function TimeBonus() {
    // The max number of time bonus possible for a question is currently 5
    // Answer within 0-1 second: +5 bonus points
    // Answer within 1-2 seconds: +4 bonus points
    // Answer within 2-3 seconds: +3 bonus points
    // Answer within 4-5 seconds: +2 bonus points
    // Answer within 5-6 seconds: +1 bonus point
    // Answer within 6+ seconds: 0 bonus points
    const [time, setTime] = useState(5);

    // Count the bonus points available down
    function handleTime() {
      if (time > 0) {
        setTime((prevTime) => prevTime - 1);

        // Store the current bonus points in local storage for simpler access by Home.jsx
        localStorage.setItem("time_bonus", time - 1);
      }
    }

    // Reset the bonus points to 5 (when the new question is displayed)
    function restartTimer() {
        localStorage.setItem("time_bonus", 5);
        clearInterval(countdown);
        setTime(5);
    }

    // Begin the countdown
    let countdown = useInterval(handleTime, 1000);

    useEffect(() => {
        // When a new question is displayed, reset the bonus points back to 5
        window.addEventListener("New Question!", restartTimer);
    }, []);
    
    return (
      <>
      </>
    );
}

export { TimeBonus }