import { Order, OrderItem, UserId } from "@/assets/types/orders";

const line = "─".repeat(30);

export const getOrderShareText = (order: Order): string => {
    const user = order.userId as UserId;

    const itemsTable = order.items.map((item: OrderItem) => {
        const name = item.foodId.name.padEnd(15).slice(0, 15);
        const qty = `x${item.quantity}`.padEnd(4);
        const price = `₹${item.foodId.price * item.quantity}`;
        return `│ ${name} │ ${qty} │ ${price.padStart(7)} │`;
    }).join("\n");

    return `
🚚 *DELIVERY ASSIGNMENT*
${line}
│ ${"Order #".padEnd(12)} │ ${order._id.slice(-6).toUpperCase().padEnd(15)} │
│ ${"Status".padEnd(12)} │ ${order.status.padEnd(15)} │
│ ${"Time".padEnd(12)} │ ${new Date(order.createdAt).toLocaleTimeString().padEnd(15)} │
│ ${"Phone".padEnd(12)} │ ${(user?.alt_phone || "N/A").padEnd(15)} │
│ ${"Payment".padEnd(12)} │ ${order.paymentMethod.padEnd(15)} │
${line}
📦 *ITEMS*
${line}
${itemsTable}
${line}
│ ${"TOTAL".padEnd(22)} │ ${"₹" + order.totalAmount.toString().padStart(7)} │
${line}
📍 *DELIVERY ADDRESS*
${user?.user_address || "N/A"}
`.trim();
};