const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = mongoose.models.Product;
const paginate = require("../middleware/pagination");

router.get("/", async (req, res) => {
  try {
    let filter = {};

    if (req.query.name) {
      filter.name = { $regex: req.query.name, $options: "i" };
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.tags) {
      const tagsArray = req.query.tags.split(",");
      filter.tags = { $all: tagsArray };
    }

    paginate(Product)(req, res, filter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
