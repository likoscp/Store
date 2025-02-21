const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: 'System' },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    problem: { type: String, required: true },
    logs: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            action: { type: String, required: true },
            date_of_action: { type: Date, default: Date.now }
        },
    ],
    status: { type: String, enum: ['not started', 'pending', 'completed', 'cancelled'], default: 'not started' },
    comments: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            comments: { type: String, required: true },
            date_of_comments: { type: Date, default: Date.now }
        },],
    attachment: [{ type: String, required: true }]
});

module.exports = mongoose.model('Ticket', TicketSchema);