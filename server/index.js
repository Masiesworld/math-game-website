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
    // ..helper function before passing it into route files
    function entryIsUnique(database_name, entry, uniqueKey) {
      const database = db.collection(database_name);
      return database.find({ [uniqueKey]: entry[uniqueKey] }).toArray()
        .then(existing_entries => {
          return !existing_entries.some(e => e[uniqueKey] === entry[uniqueKey]);
    });
}

    // Routes
    // ..system routes
    const systemRouter = require('./routes/system')
    app.use('',systemRouter)

    // ..users routes
    const usersRouter = require('./routes/users')(db, entryIsUnique);
    app.use('/users', usersRouter);

    // ..questions routes
    const questionsRouter = require('./routes/questions')(db, entryIsUnique);
    app.use('/questions', questionsRouter);




    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });





// User sign up route
app.post('/sign-up', async (req, res) => {
   let { username, password, role, class_number } = req.body;

  console.log("Received from frontend:", req.body);
  console.log("Parsed role value:", role);

  try {
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ username: username });

    if (user) {
      return res.status(404).json({ error: 'Username already exists' });
    }

    if (password.length < 8) {
      return res.status(401).json({ error: 'Password must be at least 8 characters long' });
    }

    role ? "teacher" : "student"; // Determine role based on checkbox state

    
    // Success!
    res.json({ message: 'Sign up successful!', username: username });

    // Add the user credential to the users database
    if (role == "student") {
      // class_number = 0; Default class number for students
      await usersCollection.insertOne({ username: username, password: password, role: role, class_number: 0 });
    }
    else if (role == "teacher") {
      // class_number = null; teachers will not have a class number
      await usersCollection.insertOne({ username: username, password: password, role: role, class_number: null });
    }
    console.log(`SIGNED UP WITH USERNAME ${username} + PASSWORD ${password} ENTERED` + ` + ROLE ${role}`);

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// THE TESTINGS OF A SOMEONE WHO THINKS THIS IS A PYTHON !!!
app.get('/', (req, res) => {
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