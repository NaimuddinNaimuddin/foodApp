const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            phone: user.phone,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d", // 👈 valid for 1 day
        }
    );
};

module.exports = generateToken;