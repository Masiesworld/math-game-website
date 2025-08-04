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

function TimeBonus() {
    const [time, setTime] = useState(5);

    function handleTime() {
      if (time > 0) {
        setTime((prevTime) => prevTime - 1);
        localStorage.setItem("time_bonus", time - 1);
      }
    }

    function restartTimer() {
        localStorage.setItem("time_bonus", 5);
        clearInterval(countdown);
        setTime(5);
    }

    let countdown = useInterval(handleTime, 1000);

    useEffect(() => {
        window.addEventListener("New Question!", restartTimer);
    }, []);

    return (
      <>
      </>
    );
}

export { TimeBonus }