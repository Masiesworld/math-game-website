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
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ error: 'Not allowed in production' });
    }

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
                                                class_number: initJson[i]["class_number"],
                                                avatar: initJson[i]["avatar"] });
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

      // The inputted username does not exist in the database
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // The inputted username's password does not match the user's inputted password
      if (user.password !== password) {
        return res.status(401).json({ error: 'Incorrect password' });
      }

      // Success!
      res.json({ message: 'Login successful', username: user.username, role: user.role, avatar: user.avatar });
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

  // Update a user's password
  router.post('/update-password', (req, res) => {
    const { email, password, password_check } = req.body;

    try {
      const usersCollection = db.collection('users');
      
      // The password is less than 8 characters long
      if (password.length < 8) {
        return res.status(401).json({ error: 'Password must be at least 8 characters long' });
      }

      // Password and Confirm Password do not match
      if (password != password_check) {
        return res.status(401).json({ error: 'Passwords do not match' });
      }

      usersCollection.updateOne(
        { email: email },
        {
          $set: { password: password }
        }
      );

      // Success!
      res.json({ message: 'Password reset successful' });

    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
  });

  // PUT /users/:username
  router.put('/:username', async (req, res) => {
    const { username } = req.params;
    const { newUsername, email, password} = req.body;

    try {
      const usersCollection = db.collection('users');

      // Check if the new username is already taken
      if (newUsername !== username) {
        const existingUser = await usersCollection.findOne({ username: newUsername });
        if (existingUser) {
          return res.status(409).json({ error: 'Username already taken' });
        }
      }

      const result = await usersCollection.updateOne(
        { username },
        {
          $set: {
            username: newUsername,
            email,
            password
          }
        }
      );

      console.log("Update result:", result);
      // e.g. { acknowledged: true, matchedCount: 1, modifiedCount: 1 }

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'User updated successfully' });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  });

  // Update user's avatar
  router.post('/update-avatar', (req, res) => {
    const { username, avatar } = req.body;

    try {
      const usersCollection = db.collection('users');
      usersCollection.updateOne(
        { username: username },
        {
          // Update avatar
          $set: { avatar: avatar }
        }
      );

      // Success!
      res.json({ message: 'Avatar update successful' });
      
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
};
