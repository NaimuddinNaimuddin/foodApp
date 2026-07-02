const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    alt_phone: {
        type: String,
    },
    user_address: {
        type: String,
    }
});

module.exports = mongoose.model("User", UserSchema);
