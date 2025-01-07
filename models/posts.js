const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    mainImage: { type: String, required: true },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    images: [ { type: String, required: true } ],
    status: { type: String, enum: ['public', 'private', 'archive'], default: 'public' },
    created_date: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('Post', PostSchema);