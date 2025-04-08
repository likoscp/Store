package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Product struct {
    ID       primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    Name     string             `bson:"name" json:"name" validate:"required"`
    Price    float64            `bson:"price" json:"price" validate:"required"`
    Stock    int                `bson:"stock" json:"stock" validate:"required"`
    Category string             `bson:"category" json:"category" validate:"required"`
}


// const mongoose = require('mongoose');

// const ProductSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   price: { type: Number, required: true },
//   stock: { type: Number, required: true },
//   category: { type: String, required: true },

//   tags: [{ type: String }],
//   description: { type: String, required: true },

// });

// module.exports = mongoose.model('Product', ProductSchema);