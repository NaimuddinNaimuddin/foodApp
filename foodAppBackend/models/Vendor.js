const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    name: String,
    phone: {
        type: String,
        unique: true,
    },
    password: String,
    area_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Area",
        required: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Vendor", schema);