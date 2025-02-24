const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = mongoose.models.Product;
const paginate = require('../middleware/pagination');

router.get("/",  async (req, res) => {
  try {
    let filter = {};

    if (req.query.name) {
      filter.name = { $regex: req.query.name, $options: "i" };
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.minPrice && req.query.maxPrice) {
      filter.price = {
        $gte: parseFloat(req.query.minPrice),
        $lte: parseFloat(req.query.maxPrice),
      };
    }

    if (req.query.tags) {
      const tagsArray = req.query.tags.split(",");
      filter.tags = { $all: tagsArray };
    }

    req.filter = filter;
    await paginate(Product)(req, res, () => {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;