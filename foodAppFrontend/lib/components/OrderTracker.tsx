
import { View, StyleSheet, Text } from "react-native";
import React from "react";

const ORDER_STEPS = [
    { label: "Placed", color: "#2196F3" },
    { label: "Preparing", color: "#FF9800" },
    { label: "Out for Delivery", color: "#9C27B0" },
    { label: "Delivered", color: "#4CAF50" },
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
                <React.Fragment key={step.label}>
                    <View style={styles.step}>
                        <View
                            style={[
                                styles.circle,
                                {
                                    backgroundColor:
                                        index <= current ? step.color : "#ddd",
                                },
                            ]}
                        />

                        <Text
                            style={[
                                styles.stepText,
                                {
                                    color:
                                        index <= current ? step.color : "#999",
                                },
                            ]}
                        >
                            {step.label}
                        </Text>
                    </View>

                    {index < ORDER_STEPS.length - 1 && (
                        <View
                            style={[
                                styles.line,
                                {
                                    backgroundColor:
                                        index < current
                                            ? ORDER_STEPS[index + 1].color
                                            : "#ddd",
                                },
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
    stepContainer: {
        alignItems: "center",
        width: 60,
    },
    activeCircle: {
        backgroundColor: "#2E7D32",
    },
    activeLine: {
        backgroundColor: "#2E7D32",
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
    tracker: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginVertical: 16,
    },
    step: {
        width: 58,
        alignItems: "center",
    },
    circle: {
        width: 18,
        height: 18,
        borderRadius: 9,
    },
    line: {
        flex: 1,
        height: 2,
        marginTop: 8,
        marginHorizontal: -21,
    },
    stepText: {
        marginTop: 6,
        fontSize: 11,
        textAlign: "center",
        fontWeight: "600",
    },
});