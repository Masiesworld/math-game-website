const express = require('express')
const router = express.Router();

module.exports = function(db, entryIsUnique){
  router.get('/', async (req, res) => { // fetch all users from the database
    try {
        const users = db.collection('users');
        const data = await users.find({}).toArray();
        res.json(data);

    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  router.post('/initialize-users', async (req, res) => { // test to see if we can insert initusers.json into MongoDB Compass
  try {
    const initJson = require("../initusers.json");
    const users = db.collection('users');
    
    // Insert each user and password entry into the database
    for (let i = 0; i < initJson.length; i++) {
      // Make sure we are not inserting duplicate users
      if (await entryIsUnique('users', initJson[i], "username")) {
        console.log("USER IS UNIQUE");
        let result = await users.insertOne({  username: initJson[i]["username"],
                                              email: initJson[i]["email"],
                                              password: initJson[i]["password"],
                                              role: initJson[i]["role"],
                                              total_score: initJson[i]["total_score"],
                                              class_number: initJson[i]["class_number"] });
      }
    }
    
    res.json({ message: 'Inserted', dbName: db.databaseName, users: initJson});
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // User log in route
  router.post('/login', async (req, res) => {
    const { username, password, role, total_score } = req.body;

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
      res.json({ message: 'Login successful', username: user.username, role: user.role });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Update a user's score
  router.post('/update-score', (req, res) => {
    const { username, score_increase } = req.body;

    try {
      const usersCollection = db.collection('users');
      usersCollection.updateOne(
        { username: username },
        {
          // Increment total_score by score_increase
          $inc: { total_score: score_increase }
        }
      );

      // Success!
      res.json({ message: 'Score update successful' });

    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
};
