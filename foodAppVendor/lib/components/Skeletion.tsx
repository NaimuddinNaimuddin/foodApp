import { Animated, View, StyleSheet } from "react-native";
import useSkeletonAnimation from "../hooks/useSkeletonAnimation";

export function SkeletonCard({ width = "30%", height = 120 }: any) {
    const opacity = useSkeletonAnimation();

    return (
        <Animated.View style={[
            {
                width,
                borderRadius: 8,
                opacity,
                marginBottom: 8,
            },
        ]}>
            <View style={[{ height }, styles.image]} />
            <View style={styles.text} />
        </Animated.View>
    );
}

export function SelectSkeleton({ width = "100%", height = 20, style, }: any) {
    const opacity = useSkeletonAnimation();

    return (
        <Animated.View
            style={[
                {
                    width,
                    height,
                    borderRadius: 8,
                    backgroundColor: "#E6E6E6",
                    opacity,
                },
                style,
            ]}
        />
    );
};

const styles = StyleSheet.create({
    image: {
        borderRadius: 10,
        backgroundColor: "#E6E6E6",
        marginBottom: 8,
    },
    text: {
        borderRadius: 6,
        backgroundColor: "#E6E6E6",
        width: "100%",
        alignSelf: "center",
        height: 12,
    },
});
