const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true, },
  timestamp: { type: Date, default: Date.now, },
  readStatus: { type: Boolean, default: false, },
  messageType: { type: String, enum: ['user_to_user', 'user_to_admin', 'admin_to_user'], required: true, },
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', },
  attachments: [{ fileName: String, fileUrl: String, fileType: String, },],
});

module.exports = mongoose.model('Message', MessageSchema);
