const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  lastmessage: { type: String, required: true, },
  timestamp: { type: Date, default: Date.now, },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }]
});

module.exports = mongoose.model('Conversation', ConversationSchema);
