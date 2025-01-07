const User = require('../models/users');
const express = require('express');
const userRouter = express.Router();

userRouter.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = userRouter;
