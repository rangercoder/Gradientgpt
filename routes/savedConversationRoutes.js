const express = require('express');
const SavedConversation = require('../models/SavedConversation');
const mongoose = require('mongoose');  // Import mongoose
const router = express.Router();

// Save or update a conversation (POST /api/savedConversations/save)
router.post('/save', async (req, res) => {
  const { conversationId, userId, chatHistory } = req.body;

  // Validate request body
  if (!conversationId || !userId || !chatHistory || !chatHistory.length) {
    return res.status(400).json({ error: 'Conversation ID, User ID, and chat history are required' });
  }

  try {
    // Update the existing conversation or create a new one if it doesn't exist
    const updatedConversation = await SavedConversation.findOneAndUpdate(
      { conversationId, userId },  // Match by conversationId and userId
      { $push: { chatHistory: { $each: chatHistory } } },  // Append new chat history entries to the existing array
      { new: true, upsert: true }  // Return the updated document, and create it if it doesn't exist
    );

    res.status(200).json({ message: 'Conversation updated successfully', savedConversation: updatedConversation });
  } catch (error) {
    console.error('Error saving conversation:', error.message);
    res.status(500).json({ error: 'Failed to save conversation', details: error.message });
  }
});

// Fetch all saved conversations (GET /api/savedConversations)
router.get('/', async (req, res) => {
  try {
    const savedConversations = await SavedConversation.find().populate('userId');
    res.status(200).json(savedConversations);
  } catch (error) {
    console.error('Error fetching conversations:', error.message);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      // Validate userId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid User ID' });
      }
  
      // Find all conversations where the userId matches the given userId
      const userConversations = await SavedConversation.find({ userId });
  
      if (userConversations.length === 0) {
        return res.status(404).json({ message: 'No conversations found for this user' });
      }
  
      res.status(200).json(userConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error.message);
      res.status(500).json({ error: 'Failed to fetch conversations' });
    }
  });

module.exports = router;
