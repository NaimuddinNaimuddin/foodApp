const rateLimit = require("express-rate-limit");

const adminBackstopLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 1000, // generous — single trusted admin, just a sanity cap for runaway bugs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests from this network. Admin ?",
    },
});

module.exports = adminBackstopLimiter;