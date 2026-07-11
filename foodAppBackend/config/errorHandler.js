const errorHandler = (err, req, res, next) => {
    console.error({
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method
    });
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error..."
    });
};

module.exports = errorHandler;