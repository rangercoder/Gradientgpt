const express = require('express');
const router = express.Router();


router.get('/hello', (req, res) => {
  console.log("hello");
  res.send('Hello World!');
});

module.exports = router;
