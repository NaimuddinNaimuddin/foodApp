export enum OrderStatus {
    PLACED = "Placed",
    PREPARING = "Preparing",
    ON_THE_WAY = "On The Way",
    DELIVERED = "Delivered",
    CANCELLED = "Cancelled",
};

export const ORDER_STEPS = [
    { value: OrderStatus.PLACED, color: "#2dde33" },
    { value: OrderStatus.PREPARING, color: "#d7da31" },
    { value: OrderStatus.ON_THE_WAY, color: "#2dde33" },
    { value: OrderStatus.DELIVERED, color: "#4848dc" },
];

export const getCurrentStep = (status: string) => {
    switch (status) {
        case OrderStatus.PLACED:
            return 0;

        case OrderStatus.PREPARING:
            return 1;

        case OrderStatus.ON_THE_WAY:
            return 2;

        case OrderStatus.DELIVERED:
            return 3;

        default:
            return 0;
    }
};
