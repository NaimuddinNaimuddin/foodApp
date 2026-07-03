const rateLimit = require("express-rate-limit");

const ipBackstopLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 300,            // generous ceiling — only real floods hit this
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.path.startsWith("/admin"),
    message: {
        success: false,
        message: "Too many requests from this network. IP Address.",
    },
});

module.exports = ipBackstopLimiter;