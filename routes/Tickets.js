const express = require('express');
const router = express.Router();
const Ticket = require('../models/tickets');
const middlewareAuth = require('./middlewareAuth');
const roleMiddleware = require('./RoleMiddleware');

router.post('/', roleMiddleware(["moderator", "administrator", "owner", "supplier", "B2B", "employer"]), async (req, res) => {
    try {
        const ticket = new Ticket(req.body);
        await ticket.save();
        res.status(200).json(ticket);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/', roleMiddleware(["moderator", "administrator", "owner", "supplier", "B2B", "employer"]), async (req, res) => {
    try {
        const tickets = await Ticket.find();
        res.status(200).json(tickets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', roleMiddleware(["moderator", "administrator", "owner", "supplier", "B2B", "employer"]), async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        res.status(200).json(ticket);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', roleMiddleware(["moderator", "administrator", "owner", "supplier", "B2B", "employer"]), async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(ticket);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/:id', roleMiddleware(["moderator", "administrator", "owner", "supplier", "B2B", "employer"]), async (req, res) => {
    try {
        await Ticket.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Ticket deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
