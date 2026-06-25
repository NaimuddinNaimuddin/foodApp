const express = require("express");
const router = express.Router();
const Area = require("../models/Area");

router.post("/add", async (req, res) => {
    const { code, name, status = true } = req.body;

    if (!code || !name) {
        return res.status(400).json({ message: "All Fields Are Required" });
    }

    try {
        const existingCode = await Area.findOne({ code });
        if (existingCode) {
            return res.status(400).json({ message: "Code Already Exists" });
        }

        const newArea = new Area({
            code,
            name,
            status,
        });

        await newArea.save();

        res.status(201).json({ message: "Code Added Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

router.get("/all", async (req, res) => {
    try {
        const areas = await Area.find({});
        if (!areas.length) return res.status(404).json({ message: 'No Area Found.' })
        res.status(200).json(areas);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
