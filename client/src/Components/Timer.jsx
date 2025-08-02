import { useEffect, useState, useRef } from 'react';

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

function Timer() {
    const [time, setTime] = useState(5);
    const [startTimer, setStartTimer] = useState(true);

    function handleTime() {
      if (time > 0) {
        setTime((prevTime) => prevTime - 1);
      }
      else {
        window.dispatchEvent(new Event("Game Finish!"));
      }
    }

    const countdown = useInterval(handleTime, 1000);

    return (
      <>
        <div id="timer-area">
            <h1 id="countdown">{time}</h1>
        </div>
      </>
    );
}

// export default Timer;
export { Timer }