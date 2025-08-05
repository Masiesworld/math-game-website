const express = require('express')
const router = express.Router();

router.get('/ping', (req, res) => { // testing a localhost URL... I think this is like http://localhost:3001/ping ??
  // "pong" should be displayed on the http://localhost:3001/ping URL
  res.send('pong');
});

router.get('/api/test', (req, res) => { // test frontend is reading from backend
  res.json({ message: 'Backend is working!' });
});

module.exports = router
