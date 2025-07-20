// Initialize the questions in initquestions.json into the database
async function initQuestions() {
  console.log("INITIALIZE QUESTIONS");
  try {
    const response = await fetch('http://localhost:3001/questions/initialize-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    console.log("questions after the await");
    const data = await response.json();
    console.log("questions after the data; data is: ");
    console.log(data);
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
  console.log("INITIALIZE USERS");
  try {
    const response = await fetch('http://localhost:3001/users/initialize-users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    console.log("users after the await");
    const data = await response.json();
    console.log("users after the data; data is: ");
    console.log(data);
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
  console.log("get questions called");
  try {
    const response = await fetch('http://localhost:3001/questions', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    console.log("after the await");
    const data = await response.json();
    console.log("after the data; data is: ");
    console.log(data);
    return data;
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
  console.log("getUsers called");
  try {
    const response = await fetch('http://localhost:3001/users', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    console.log("after the await");
    const data = await response.json();
    console.log("after the data; data is: ");
    console.log(data);
    return data;
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

// Let the console know that Iniitalize.ksx has been called (ideally this should be called first I think at the moment)
console.log("Initialize.jsx has been called");

// Initialize the database
// initQuestions();
// initUsers();

export { initQuestions, initUsers, getQuestions, getUsers };