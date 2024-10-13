const mongoose = require('mongoose');

const SavedConversationSchema = new mongoose.Schema({
  conversationId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chatHistory: [
    {
      userQuery: { type: String, required: true },
      apiResponse: {
        summary: String,
        result_text: String,
        result_table_path: String,
        result_visualization_path: String,
        error: String
      }
    }
  ],
  savedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SavedConversation', SavedConversationSchema);
