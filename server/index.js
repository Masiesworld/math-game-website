require('dotenv').config();
const express = require('express'); // necessary for backend server
const cors = require('cors'); // necessary for frontend to access backend
const connectDB = require('./db/connect'); // function to connect to MongoDB

const app = express();
const PORT = process.env.PORT || 5000;

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

app.post('/questions', async (req, res) => { // add a new question to the database with use of init.json
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
