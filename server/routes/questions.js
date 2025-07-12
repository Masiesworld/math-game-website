const express = require('express')
const router = express.Router();


module.exports = function (db, entryIsUnique){
    router.post('/', async (req, res) => { // add a new question/answer to the database with use of init.json
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

    router.get('/', async (req, res) => { // fetch all questions from the database
    try {
        const questions = db.collection('questions');
        const data = await questions.find({}).toArray();
        res.json(data);

    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
    });



    router.get('/test-insert', async (req, res) => { // test to see if we can insert a question
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

    router.get('/initialize-questions', async (req, res) => { // test to see if we can insert initquestions.json into MongoDB Compass
    try {
        const initJson = require("../initquestions.json");
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


return router;
}


