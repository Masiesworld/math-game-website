import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { initQuestions, initUsers, getQuestions, getUsers } from './Initialize.jsx'
import './index.css'

const App = lazy(() => import('./App.jsx')); // "wait" to load App.jsx; we should initialize the database before loading App.jsx

async function shouldInitUsers() {
  // Call the backend to fetch all users from the database
  const res = await fetch('http://localhost:3001/users');
  const data = await res.json();
  return data.length === 0;
}

// Updated this to avoid duplicate user accounts from initusers.json after editing the original username from Profile settings
shouldInitUsers().then((shouldInit) => {
  // If the users database hasn't already been initialized, initialize the users in the database. Otherwise, get the users
  const init = shouldInit ? initUsers() : getUsers();
  
  // "wait" to initialize all of the questions in the database
  Promise.all([initQuestions(), init])
    .then(([_, users]) => {
      // Get the questions
      return getQuestions().then((questions) => {
        const root = createRoot(document.getElementById('root'));
        root.render(
          <StrictMode>
            <Suspense>
              {/* Supply App.jsx with the database questions and users */}
              <App questions={questions} users={users} />
            </Suspense>
          </StrictMode>
        );
      });
    });
});
