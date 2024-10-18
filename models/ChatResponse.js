const mongoose = require('mongoose');

const ChatResponseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  
  userQuery: { type: String, required: true },
  apiResponse: {
    summary: String,
    result_text: String,
    result_table_path: String,
    result_visualization_path: String,
    error: String,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ChatResponse', ChatResponseSchema);
