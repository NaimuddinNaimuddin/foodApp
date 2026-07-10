const clients = new Map();

function addClient(areaId, res) {
    if (!clients.has(areaId)) {
        clients.set(areaId, new Set());
    }
    clients.get(areaId).add(res);
    console.log(`Client connected to area: ${areaId}. Total in area: ${clients.get(areaId).size}`);
}

function removeClient(areaId, res) {
    const areaClients = clients.get(areaId);
    if (!areaClients) return;

    areaClients.delete(res);
    console.log(`Client disconnected from area: ${areaId}. Remaining: ${areaClients.size}`);

    // clean up empty area entry
    if (areaClients.size === 0) {
        clients.delete(areaId);
    }
}

function notifyNewOrder(order) {
    const areaId = order.areaId?.toString();
    if (!areaId) return;

    const areaClients = clients.get(areaId);
    if (!areaClients?.size) {
        console.log(`No clients connected for area: ${areaId}`);
        return;
    }

    const payload = `data: ${JSON.stringify({ type: "new_order", order })}\n\n`;

    areaClients.forEach((client) => {
        try {
            client.write(payload);
        } catch (err) {
            console.error(`Failed to write to client in area ${areaId}:`, err);
            removeClient(areaId, client); // remove dead connections
        }
    });

    console.log(`Notified ${areaClients.size} client(s) in area: ${areaId}`);
}

module.exports = {
    addClient,
    removeClient,
    notifyNewOrder,
};
