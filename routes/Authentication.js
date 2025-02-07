const express = require('express');
const router = express.Router();
const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret }  = require('../config');
const middlewareAuth = require('./middlewareAuth');
const roleMiddleware = require('./RoleMiddleware');
const path = require('path');

const generateAccessToken = (id, role) => {
    const payload = {
        id,
        role
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"} )
}

router.post('/sign-up', async (req, res) => {
    try {
        const { email, password, name, phone } = req.body;
        const existingUser = await User.findOne({ email: email });
        if ( existingUser ) {
            return res.status(400).json({ error: "User already exist" });
        }
        const hashPassword = bcrypt.hashSync( password, 2 )
        const user = new User( { email, hashPassword, name, phone } );
        await user.save();
        res.status(200).json( user ) ;
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/sign-in', (req, res) => {
    res.sendFile(path.join(__dirname, '../view/login.html')); 
});

router.post('/sign-in', async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return res.status(400).json({ error: "User doesn't exist" });
        }
        if (!existingUser.hashPassword) {
            return res.status(400).json({ error: "Invalid user data" });
        }
        const isPasswordValid = bcrypt.compareSync(password, existingUser.hashPassword);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Password incorrect" });
        }
        const token = generateAccessToken(existingUser._id, existingUser.role);
        res.json({ token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
