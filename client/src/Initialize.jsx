// Initialize the questions in initquestions.json into the database
async function initQuestions() {
  // INITIALIZE QUESTIONS (debug log removed)
  try {
    const response = await fetch('http://localhost:3001/questions/initialize-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();

    // debug logs removed

    if (response.ok) {
      // pass
    }
    else {
      // pass
    }
  } catch (error) {
    console.error('Login error:', error);
    // pass
  }
}

// Initialize the users in initusers.json into the database
async function initUsers() {
  // INITIALIZE USERS (debug log removed)
  try {
    const response = await fetch('http://localhost:3001/users/initialize-users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();

    // debug logs removed
    
    if (response.ok) {
      // pass
    }
    else {
      // pass
    }
  } catch (error) {
    console.error('Login error:', error);
    // pass
  }
}

// Get the questions from the server
async function getQuestions() {
  // get questions called
  try {
    const response = await fetch('http://localhost:3001/questions', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();

    // debug logs removed

    if (response.ok) {
      return data;
    }
    else {
      return "";
    }
  } catch (error) {
    console.error('Login error:', error);
  }
}

// Get the users from the database
async function getUsers() {
  // getUsers called
  try {
    const response = await fetch('http://localhost:3001/users', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();

    // debug logs removed

    if (response.ok) {
      return data;
    }
    else {
      return "";
    }
  } catch (error) {
    console.error('Login error:', error);
  }
}

// Let the console know that Initialize.jsx has been called (ideally this should be called first I think at the moment)
// Initialize.jsx has been called (debug log removed)

export { initQuestions, initUsers, getQuestions, getUsers };