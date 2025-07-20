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

  return router;
};