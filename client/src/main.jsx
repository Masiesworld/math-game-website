import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { initQuestions, initUsers, getQuestions, getUsers } from './Initialize.jsx'
import './index.css'

const App = lazy(() => import('./App.jsx'));

// Make sure we have loaded the json files into the server before proceeding
Promise.all([initQuestions(), initUsers()])
  .then((init_responses) => {
    let questions = getQuestions();
    let users = getUsers();

    // Make sure we have the json information from the server before proceeding
    Promise.all([questions, users])
      .then((get_responses) => {
        const root = createRoot(document.getElementById('root'));
        root.render(
          <StrictMode>
            {console.log("YALL GOT HERE!??!?!")}
            <Suspense>
              {console.log(get_responses[0])}
              <App questions={get_responses[0]} users={get_responses[1]}/>
            </Suspense>
          </StrictMode>,
        )
      });
  });
