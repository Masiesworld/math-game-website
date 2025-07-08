require('dotenv').config();
const express = require('express');
const connectDB = require('./db/connect');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

let db; // global db variable

connectDB(process.env.MONGO_URI)
  .then((client) => {
    db = client.db('my-math-game');

    // ✅ Start server only after DB connects
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB', err);
  });

// 🟢 Routes

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.post('/questions', async (req, res) => {
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

app.get('/questions', async (req, res) => {
  try {
    const questions = db.collection('questions');
    const data = await questions.find({}).toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});
