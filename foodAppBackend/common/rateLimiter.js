const rateLimit = require("express-rate-limit");

/**
 * Creates a configurable rate limiter middleware.
 * @param {number} windowMs - Time window in milliseconds
 * @param {number} max - Max number of requests allowed in the window
 * @param {string} [message] - Optional custom message
 */
const rateLimiter = (windowMs, max, message = "Too many requests, please try again later.") => {
    return rateLimit({
        windowMs,
        max,
        standardHeaders: true, // return rate limit info in RateLimit-* headers
        legacyHeaders: false,
        message: {
            success: false,
            message,
        },
    });
};

module.exports = rateLimiter;