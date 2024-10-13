const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Create a new user (POST /api/users)
router.post('/', async (req, res) => {
  const { username, email } = req.body;

  // Log the received values
  console.log('Username:', username);
  console.log('Email:', email);

  // Check if username and email are provided
  if (!username || !email) {
    return res.status(400).json({ error: 'Username and email are required' });
  }

  try {
    const newUser = new User({ username, email });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error.message);
    if (error.code === 11000) {
      res.status(409).json({ error: 'Username or email already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create user', details: error.message });
    }
  }
});

module.exports = router;
