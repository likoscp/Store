const express = require('express');
const router = express.Router();
const User = require('../models/users');
const middlewareAuth = require('../middleware/middlewareAuth');
const roleMiddleware = require('../middleware/RoleMiddleware');
const paginate = require('../middleware/pagination');
router.post('/', roleMiddleware(["moderator", "administrator", "owner"]), async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', roleMiddleware(["moderator", "administrator", "owner", "supplier", "B2B", "employer"]), paginate(User));

router.get('/:id', roleMiddleware(["moderator", "administrator", "owner", "supplier", "B2B", "employer"]), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', roleMiddleware(["moderator", "administrator", "owner"]), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', roleMiddleware(["moderator", "administrator", "owner"]), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
