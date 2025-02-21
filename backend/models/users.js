const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String },
  status: { type: String, enum: ['deleted', 'active', 'blocked'], default: 'active' },
  loyalityLevel: { type: Number, default: '1', required: true },
  role: { type: String, enum: ['user', 'moderator', 'administrator', 'owner', 'supplier', 'B2B', 'employer'], default: 'user' },
  created_date: { type: Date, default: Date.now },
  hashPassword: { type: String, required: true },
});

module.exports = mongoose.model('User', UserSchema);