import { useEffect, useState } from 'react'
import './Footer.css'

function Footer(){

    const [message, setMessage] = useState('Loading...');
    
      useEffect(() => {
        fetch('http://localhost:3001/api/test') // Your Express route
          .then(res => res.json())
          .then(data => setMessage(data.message))
          .catch(err => {
            console.error('Error fetching from backend:', err);
            setMessage('Error connecting to backend');
          });
      }, []);

    return(
        <footer className="footer">
            <p className="text-footer">
            Made by: Macy Yu, Kyle Wostbrock, Rafael Hinchey, and Nicholas Lucky.....{message}
            </p>
        </footer>
    )
}

export default Footer