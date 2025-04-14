package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Order struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID      primitive.ObjectID `bson:"user_id" json:"user_id"`
	Items       []OrderItem        `bson:"items" json:"items"`
	Status      string             `bson:"status" json:"status"`
	OrderDate   primitive.DateTime `bson:"order_date" json:"order_date"`
	TotalPrice  float64           `bson:"total_price" json:"total_price"`
}

type OrderItem struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	ProductID primitive.ObjectID `bson:"product_id" json:"product_id"`
	Quantity  int                `bson:"quantity" json:"quantity"`
}

// const mongoose = require('mongoose');

// const OrderSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   items: [
//     {
//       productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
//       quantity: { type: Number, required: true },
//     },
//   ],
//   status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
//   order_date: { type: Date, default: Date.now }
// });

// OrderSchema.index({ userId: 1, status: 1 });

// module.exports = mongoose.model('Order', OrderSchema);