const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  description: { type: String, required: true },
});

module.exports = mongoose.model('Product', ProductSchema);