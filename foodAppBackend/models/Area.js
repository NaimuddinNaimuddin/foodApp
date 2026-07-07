const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    delivery_charge_in_rs: {
        type: Number,
        required: true,
        default: 20,
    },
    delivery_text: {
        type: String,
    },
    status: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Area", schema);
