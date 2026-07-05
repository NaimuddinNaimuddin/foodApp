const rateLimit = require("express-rate-limit");

/**
 * Creates a configurable rate limiter middleware.
 * @param {number} windowMs - Time window in milliseconds
 * @param {number} max - Max number of requests allowed in the window
 * @param {string} [message] - Optional custom message
 */
const rateLimiter = (windowMs, max, message = "Too many requests, Please try again later.") => {
    return rateLimit({
        windowMs,
        max,
        standardHeaders: true, // return rate limit info in RateLimit-* headers
        legacyHeaders: false,
        keyGenerator: (req) => {
            const userId =
                req.params?.userId ||
                req.params?.user_id ||
                req.body?.userId ||
                req.body?.user_id;

            return userId ? userId.toString() : rateLimit.ipKeyGenerator(req.ip);
        },
        message: {
            success: false,
            message,
        },
    });
};

module.exports = rateLimiter;