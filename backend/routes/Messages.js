const express = require('express');
const router = express.Router();
const Message = require('../models/messages');
const middlewareAuth = require('../middleware/middlewareAuth');
const roleMiddleware = require('../middleware/RoleMiddleware');
const paginate = require('../middleware/pagination');
router.post('/', async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    res.status(200).json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', roleMiddleware(["moderator", "administrator", "owner", "supplier", "B2B", "employer"]), paginate(Message));

router.get('/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;