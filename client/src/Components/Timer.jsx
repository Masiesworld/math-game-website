import { useEffect, useState, useRef } from 'react';

// note: learn this first
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

console.log("Timer.jsx called");

function Timer() {
    const [time, setTime] = useState(5);

    function handleTime() {
        if (time > 0)
            console.log(time);
            setTime((prevTime) => prevTime - 0.5);
    }

    useEffect(() => {
        // This gets called twice??
        const countdown = setInterval(handleTime, 1000);
    }, []);

    return (
        <div id="timer-area">
            <h1 id="countdown">{time}</h1>
        </div>
    );
}

export default Timer;