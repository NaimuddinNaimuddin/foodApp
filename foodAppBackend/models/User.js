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
    },
    is_phone_verified: {
        type: Boolean,
    },
    is_address_verified: {
        type: Boolean,
    },
    status: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
