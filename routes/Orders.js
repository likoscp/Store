const express = require('express');
const router = express.Router();
const Order = require('../models/orders');

router.post('/', async (req, res) => {
  try {
    const order = new Order (req.body);
    await order .save();
    res.status(200).json(order );
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const orders = await Order .find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const order = await Order .findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(order );
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Order .findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
