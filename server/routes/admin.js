const express = require('express');
const { ReturnDocument } = require('mongodb');

module.exports = function(db) {
  const router = express.Router();

  // GET all users
  router.get('/users', async (req, res) => {
    try {
      const usersCollection = db.collection('users');
      const users = await usersCollection.find().toArray();
      res.json(users); // send list of users
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

// POST assign class number to a user
router.post('/assign', async (req, res) => {
  const { username, class_number } = req.body;

  try {
    const usersCollection = db.collection('users');
    const result = await usersCollection.findOneAndUpdate(
      { username: username },
      { $set: {class_number: class_number} },
      { ReturnDocument: 'after' }
    );

    res.json({ message: 'Class number assigned', user: result.value });
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).send('Server error');
  }
});

// POST add a new question
router.post('/add-question', async (req, res) => {
  const { question, answer, incorrects, difficulty } = req.body;

  try {
    const questionsCollection = db.collection('questions');
    const newQuestion = {
      question,
      answer,
      incorrects,
      difficulty
    };
    const result = await questionsCollection.insertOne(newQuestion);
    res.status(201).json({ message: 'Question added', questionId: result.insertedId });
  } catch (err) {
    console.error('Error adding question:', err);
    res.status(500).json({ error: 'Failed to add question' });
  }
});

// GET all questions
router.get('/questions', async (req, res) => {
  try {
    const questions = await db.collection('questions').find().toArray();
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

  return router;
};