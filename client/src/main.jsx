import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { initQuestions, initUsers, getQuestions, getUsers } from './Initialize.jsx'
import './index.css'

const App = lazy(() => import('./App.jsx'));

async function shouldInitUsers() {
  const res = await fetch('http://localhost:3001/users');
  const data = await res.json();
  return data.length === 0;
}

// Updated this to avoid duplicate user accounts from initusers.json after editing the original username from Profile settings
shouldInitUsers().then((shouldInit) => {
  const init = shouldInit ? initUsers() : getUsers();
  
  Promise.all([initQuestions(), init])
    .then(([_, users]) => {
      return getQuestions().then((questions) => {
        const root = createRoot(document.getElementById('root'));
        root.render(
          <StrictMode>
            <Suspense>
              <App questions={questions} users={users} />
            </Suspense>
          </StrictMode>
        );
      });
    });
});

