const express = require('express');
const router = express.Router();
const Order = require('../models/orders');
const middlewareAuth = require('../middleware/middlewareAuth');
const roleMiddleware = require('../middleware/RoleMiddleware');
const paginate = require('../middleware/pagination');

router.post('/',  async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.get('/', roleMiddleware(["moderator", "administrator", "owner", "supplier", "B2B", "employer"]), paginate(Order));

router.get('/:id', roleMiddleware(["moderator", "administrator", "owner", "supplier", "B2B", "employer"]), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', roleMiddleware(["moderator", "administrator", "owner", "supplier", "B2B", "employer"]), async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', roleMiddleware(["moderator", "administrator", "owner", "supplier", "B2B", "employer"]), async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/user/:id', roleMiddleware(["moderator", "administrator", "owner", "supplier", "B2B", "employer"]), async (req, res) => {
  try {
    const order = await Order.find({ userId: req.params.id});
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/userstatus/:id', roleMiddleware(["moderator", "administrator", "owner", "supplier", "B2B", "employer"]), async (req, res) => {
  try {
    const order = await Order.find({ userId: req.params.id, status: 'pending' });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;