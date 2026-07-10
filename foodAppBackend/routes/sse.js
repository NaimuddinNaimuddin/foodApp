// routes/sse.js
const express = require("express");
const router = express.Router();
const { addClient, removeClient } = require("../common/sse");

router.get("/orders/:areaId", (req, res) => {
    const { areaId } = req.params;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    // heartbeat every 30s to keep connection alive
    const heartbeat = setInterval(() => res.write(": heartbeat\n\n"), 30000);

    addClient(areaId, res);

    req.on("close", () => {
        clearInterval(heartbeat);
        removeClient(areaId, res);
    });
});

module.exports = router;