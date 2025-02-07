const express = require('express');
const router = express.Router();
const Post = require('../models/posts');
const middlewareAuth = require('./middlewareAuth');
const roleMiddleware = require('./RoleMiddleware');
const paginate = require('../middleware/pagination');
router.post('/', roleMiddleware(["moderator", "administrator", "owner", "supplier", "B2B", "employer"]), async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', roleMiddleware(["moderator", "administrator", "owner", "supplier", "B2B", "employer"]), async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', roleMiddleware(["moderator", "administrator", "owner", "supplier", "B2B", "employer"]), async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
