const express = require('express');
const router = express.Router();
const ChatResponse = require('../models/ChatResponse');
const User = require('../models/User');

// Save Chat Response under a specific user (POST /api/chat/save)
router.post('/save', async (req, res) => {
  const { userId, query, apiResponse } = req.body;

  // Validate request body
  if (!userId || !query || !apiResponse) {
    return res.status(400).json({ error: 'User ID, query, and response are required' });
  }

  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create a new chat response document
    const newChatResponse = new ChatResponse({
      userId: user._id,
      userQuery: query,
      apiResponse,  // Assuming the apiResponse is an object with structured fields
    });

    // Save the chat response to MongoDB
    await newChatResponse.save();
    
    // Return success response with the saved chat response
    res.status(201).json({ message: 'Chat response saved successfully', chatResponse: newChatResponse });
  } catch (error) {
    console.error('Error saving chat response:', error.message);
    res.status(500).json({ error: 'Failed to save chat response', details: error.message });
  }
});

module.exports = router;
