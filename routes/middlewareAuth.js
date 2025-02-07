const jwt = require('jsonwebtoken')
const path = require('path')
const { secret } = require('../config')

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        return next();
    }

    try {
        const token = req.headers.authorization?.split(' ')[1]; 
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }        
        const decodedData = jwt.verify(token, secret);
        req.user = decodedData;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ error: "Invalid token" });
    }
};
