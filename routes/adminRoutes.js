const express = require('express');
const router = express.Router();
const User = require('../models/User');
const SavedConversation = require('../models/SavedConversation');

// Get all users and their saved chats sorted by userId (GET /api/admin/users)
router.get('/users', async (req, res) => {
  try {
    // Fetch all users
    const users = await User.find().select('-__v');

    
    const userSavedChats = await SavedConversation.find()
      .populate('userId', 'username')  
      .sort({ userId: 1 });  

    res.status(200).json({ users, userSavedChats });
  } catch (error) {
    console.error('Error fetching users and saved chats:', error);
    res.status(500).json({ error: 'Failed to fetch users and saved chats' });
  }
});

module.exports = router;
