// server/db/connect.js
const { MongoClient } = require('mongodb');

let client;

async function connectDB(uri) {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connected to MongoDB');
  }
  return client;
}

module.exports = connectDB;
