
import { View, StyleSheet, Text } from "react-native";
import React from "react";

const ORDER_STEPS = [
    "Placed",
    "Preparing",
    "Out for Delivery",
    "Delivered",
];

const getCurrentStep = (status: string) => {
    switch (status?.toLowerCase()) {
        case "placed":
        case "pending":
            return 0;

        case "preparing":
        case "accepted":
            return 1;

        case "out for delivery":
        case "on the way":
            return 2;

        case "delivered":
            return 3;

        default:
            return 0;
    }
};

const OrderTracker = ({ status }: { status: string }) => {
    const current = getCurrentStep(status);

    return (
        <View style={styles.tracker}>
            {ORDER_STEPS.map((step, index) => (
                <React.Fragment key={step}>
                    <View style={styles.stepContainer}>
                        <View
                            style={[
                                styles.circle,
                                index <= current && styles.activeCircle,
                            ]}
                        />

                        <Text
                            style={[
                                styles.stepText,
                                index <= current && styles.activeStepText,
                            ]}
                        >
                            {step}
                        </Text>
                    </View>

                    {index !== ORDER_STEPS.length - 1 && (
                        <View
                            style={[
                                styles.line,
                                index < current && styles.activeLine,
                            ]}
                        />
                    )}
                </React.Fragment>
            ))}
        </View>
    );
};


export default OrderTracker;

const styles = StyleSheet.create({
    tracker: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginTop: 15,
        marginBottom: 12,
    },

    stepContainer: {
        alignItems: "center",
        width: 60,
    },

    circle: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: "#ddd",
    },

    activeCircle: {
        backgroundColor: "#2E7D32",
    },

    line: {
        flex: 1,
        height: 3,
        backgroundColor: "#ddd",
        marginTop: 8,
    },

    activeLine: {
        backgroundColor: "#2E7D32",
    },

    stepText: {
        marginTop: 6,
        fontSize: 11,
        textAlign: "center",
        color: "#999",
    },

    activeStepText: {
        color: "#2E7D32",
        fontWeight: "600",
    },

    currentStatus: {
        color: "#2E7D32",
        fontWeight: "600",
        marginBottom: 8,
    },
});