const config = require("../config");
const jwt = require("jsonwebtoken");
const logger= require("../config/logger")

exports.userContext = (req, res, next) => {
    const authHeader = req.headers && (req.headers.authorization || req.headers.Authorization);
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: "access token is required" });
    }
    try {
        const payload = jwt.verify(token, config.JWT_INNER_ACCESS_SECRET);
         if (!payload.sub) {
            logger.info("Invalid internal token payload");
            return res.status(401).json({ error: 'Invalid internal token' });
        }
        req.user ={id: payload.sub};
        return next();
    } catch (err) {
        return res.status(403).json({ error: "invalid or expired token" });
    }
};