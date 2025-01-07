const Order = require('../models/orders');
const express = require('express');
const orderRouter = express.Router();

orderRouter.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = orderRouter;
