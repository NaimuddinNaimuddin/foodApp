
import { View, StyleSheet, Text } from "react-native";
import React from "react";
import { ORDER_STEPS, getCurrentStep } from "@/lib/constant";

const OrderTracker = ({ status }: { status: string }) => {
    const current = getCurrentStep(status);

    return (
        <View style={styles.tracker}>
            {ORDER_STEPS.map((step, index) => (
                <React.Fragment key={step.value}>
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
                            {step.value}
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