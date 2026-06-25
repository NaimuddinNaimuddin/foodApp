const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    code: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
});

module.exports = mongoose.model("Area", schema);
