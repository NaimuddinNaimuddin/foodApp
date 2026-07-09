export const ORDER_STEPS = [
    { value: "PLACED", label: "Placed", color: "#2dde33" },
    { value: "PREPARING", label: "Preparing", color: "#d7da31" },
    { value: "OUT_FOR_DELIVERY", label: "Out for Delivery", color: "#d73333" },
    { value: "DELIVERED", label: "Delivered", color: "#4848dc" },
];

export const getCurrentStep = (status: string) => {
    switch (status?.toLowerCase()) {
        case "pending":
        case "placed":
            return 0;

        case "accepted":
        case "preparing":
            return 1;

        case "on the way":
        case "out for delivery":
            return 2;

        case "delivered":
            return 3;

        default:
            return 0;
    }
};
