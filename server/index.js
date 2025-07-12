require('dotenv').config({ path: 'test.env' });
const express = require('express'); // necessary for backend server
const cors = require('cors'); // necessary for frontend to access backend
const connectDB = require('./db/connect'); // function to connect to MongoDB

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

let db; // global db variable

connectDB(process.env.MONGO_URI)
  .then((client) => {
    db = client.db('Math-Trials');
    console.log('Using database:', db.databaseName);


    // Start server only after DB connects
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });

// Routes

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.post('/questions', async (req, res) => { // add a new question/answer to the database with use of init.json
  try {
    const questions = db.collection('questions');
    const newQuestion = req.body;
    const result = await questions.insertOne(newQuestion);

    res.status(201).json({ message: 'Question added', id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.get('/questions', async (req, res) => { // fetch all questions from the database
  try {
    const questions = db.collection('questions');
    const data = await questions.find({}).toArray();
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

app.get('/api/test', (req, res) => { // test frontend is reading from backend
  res.json({ message: 'Backend is working!' });
});

app.get('/test-insert', async (req, res) => { // test to see if we can insert a question
  try {
    const questions = db.collection('questions');
    const result = await questions.insertOne({ question: "Test question?", answer: 42 });
    res.json({ message: 'Inserted', id: result.insertedId, dbName: db.databaseName });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function entryIsUnique(database_name, entry, uniqueKey) {
  const database = db.collection(database_name);
  const existing_entries = await database.find({}).toArray();

  for (let i = 0; i < existing_entries.length; i++) {
      if (entry[uniqueKey] == existing_entries[i][uniqueKey])
        return false;
  }

  return true;
}

app.get('/initialize-questions', async (req, res) => { // test to see if we can insert initquestions.json into MongoDB Compass
  try {
    const initJson = require("./initquestions.json");
    const questions = db.collection('questions');

    // Insert each question and answer entry into the database
    for (let i = 0; i < initJson.length; i++) {
      // Make sure we are not inserting duplicate questions
      if (await entryIsUnique('questions', initJson[i], "question")) {
        console.log("QUESTION IS UNIQUE");
        let result = await questions.insertOne({ question: initJson[i]["question"], answer: initJson[i]["answer"] });
      }
    }

    res.json({ message: 'Inserted', dbName: db.databaseName, questions: initJson});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/initialize-users', async (req, res) => { // test to see if we can insert initusers.json into MongoDB Compass
  try {
    const initJson = require("./initusers.json");
    const users = db.collection('users');

    // Insert each user and password entry into the database
    for (let i = 0; i < initJson.length; i++) {
      // Make sure we are not inserting duplicate users
      if (await entryIsUnique('users', initJson[i], "username")) {
        console.log("USER IS UNIQUE");
        let result = await users.insertOne({ username: initJson[i]["username"], password: initJson[i]["password"] });
      }
    }

    res.json({ message: 'Inserted', dbName: db.databaseName, users: initJson});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User log in route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Success!
    res.json({ message: 'Login successful', username: user.username });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// THE TESTINGS OF A SOMEONE WHO THINKS THIS IS A PYTHON !!!
app.get('/', async (req, res) => {
  let header = `This is the default http://localhost:${PORT} URL!`;

  let otherURLs = "\n\nThe other URLs are:";
  let URL_one = `\n1. http://localhost:${PORT}/ping --> pong`;
  let URL_two = `\n2. http://localhost:${PORT}/questions --> fetch all questions from the database`;
  let URL_three = `\n3. http://localhost:${PORT}/api/test --> test frontend is reading from backend`;
  let URL_four = `\n4. http://localhost:${PORT}/test-insert --> test to see if we can insert a question`;

  let full = header + otherURLs + URL_one + URL_two + URL_three + URL_four;

  res.set('Content-Type', 'text/plain');
  res.send(full);
});