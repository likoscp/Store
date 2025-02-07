const express = require('express');
const router = express.Router();
const Product = require('../models/products');
const middlewareAuth = require('./middlewareAuth');
const roleMiddleware = require('./RoleMiddleware');
const paginate = require('../middleware/pagination');
router.post('/', roleMiddleware(["moderator", "administrator", "owner", "supplier", "B2B", "employer"]), async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', paginate(Product));

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', roleMiddleware(["moderator", "administrator", "owner", "supplier", "B2B", "employer"]), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', roleMiddleware(["moderator", "administrator", "owner", "supplier", "B2B", "employer"]), async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
