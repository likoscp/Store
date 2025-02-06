const jwt = require('jsonwebtoken');
const { secret } = require('../config');

module.exports = function (roles) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            return next();
        }
        try {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(403).json({ message: "User is not authorized" });
            }
            const decoded = jwt.verify(token, secret);
            const userRole = decoded.role;
            if (!roles.includes(userRole)) {
                return res.status(403).json({ message: "You don't have access" });
            }
            next();
        } catch (e) {
            console.log(e);
            return res.status(403).json({ message: "User is not authorized" });
        }
    };
};