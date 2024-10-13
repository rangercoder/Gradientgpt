const express = require('express');
const SavedConversation = require('../models/SavedConversation');
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

module.exports = router;
