const clients = [];

function addClient(res) {
    clients.push(res);
    console.log("Admin connected. Total:", clients.length);
}

function removeClient(res) {
    const index = clients.indexOf(res);
    if (index !== -1) clients.splice(index, 1);
    console.log("Admin disconnected. Total:", clients.length);
}

function notifyNewOrder(order) {
    clients.forEach((client) => {
        client.write(
            `data: ${JSON.stringify({
                type: "new_order",
                order,
            })}\n\n`
        );
    });
}

module.exports = {
    addClient,
    removeClient,
    notifyNewOrder,
};
