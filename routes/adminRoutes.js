const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ChatResponse = require('../models/ChatResponse');

// Get all users and their saved prompts (GET /api/admin/users)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-__v');  // Fetch all users
    const userPrompts = await ChatResponse.find().populate('userId', 'username');  // Fetch prompts with user details

    res.status(200).json({ users, userPrompts });
  } catch (error) {
    console.error('Error fetching users and prompts:', error);
    res.status(500).json({ error: 'Failed to fetch users and prompts' });
  }
});

module.exports = router;
