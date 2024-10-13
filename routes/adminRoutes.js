const express = require('express');
const router = express.Router();
const User = require('../models/User');
const SavedConversation = require('../models/SavedConversation');

// Get all users and their saved chats sorted by userId (GET /api/admin/users)
router.get('/users', async (req, res) => {
  try {
    // Fetch all users
    const users = await User.find().select('-__v');

    // Fetch saved conversations, populate user details, and sort by userId
    const userSavedChats = await SavedConversation.find()
      .populate('userId', 'username')  // Populate username from User collection
      .sort({ userId: 1 });  // Sort by userId in ascending order

    res.status(200).json({ users, userSavedChats });
  } catch (error) {
    console.error('Error fetching users and saved chats:', error);
    res.status(500).json({ error: 'Failed to fetch users and saved chats' });
  }
});

module.exports = router;
