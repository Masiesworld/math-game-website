const express = require('express')
const router = express.Router();

router.get('/ping', (req, res) => {
  res.send('pong');
});

router.get('/api/test', (req, res) => { // test frontend is reading from backend
  res.json({ message: 'Backend is working!' });
});


module.exports = router