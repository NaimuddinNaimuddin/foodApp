import React, { useState } from "react";
import {
    View,
    TextInput,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    Pressable,
    ActivityIndicator,
} from "react-native";
import { useUpdateUserDetails } from "../hooks/useUpdateUserDetails";
import { useUser } from "@/context/userContext";

const EditAddressField = ({ modalVisible, setModalVisible }: { modalVisible: boolean, setModalVisible: (modalVisible: boolean) => void }) => {
    const { user, setUser, colors } = useUser();
    const [tempAddress, setTempAddress] = useState<string | undefined>(user?.user_address || '');
    const [tempPhone, setTempPhone] = useState<string | undefined>(user?.alt_phone || '');

    const { updateUserDetails, isLoading, error } = useUpdateUserDetails();

    const handleSave = async () => {
        const USER_ID = user?.id;
        if (!USER_ID) return;
        if (tempAddress == user?.user_address && tempPhone == user?.alt_phone) return;

        const success = await updateUserDetails({
            user_id: USER_ID,
            user_address: tempAddress,
            alt_phone: tempPhone,
        });

        if (success) {
            setModalVisible(false);
            setUser({ ...user, user_address: tempAddress, alt_phone: tempPhone });
        }
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    return (
        <Modal
            visible={modalVisible}
            transparent
            animationType="slide"
            onRequestClose={handleCancel}
        >
            <Pressable style={styles.overlay} onPress={handleCancel}>
                <Pressable style={styles.modalContent} onPress={() => { }}>
                    <Text style={styles.modalTitle}>Edit Delivery Address</Text>
                    <TextInput
                        style={[styles.modalInput, { outlineColor: colors.outlineColor, borderColor: colors.borderColor }]}
                        placeholder="Enter delivery address"
                        value={tempAddress}
                        onChangeText={setTempAddress}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        autoComplete="tel"
                        maxLength={130}
                    />
                    <Text style={styles.modalTitle}>Edit Delivery Phone</Text>
                    <TextInput
                        style={[styles.input, { outlineColor: colors.outlineColor, borderColor: colors.borderColor }]}
                        keyboardType="phone-pad"
                        maxLength={10}
                        value={tempPhone}
                        onChangeText={(text) => setTempPhone(text.replace(/[^0-9]/g, ""))}
                    />

                    <Text style={styles.error} >{error}</Text>
                    <View style={styles.modalActions}>
                        <TouchableOpacity onPress={handleCancel} style={styles.cancelBtn}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity disabled={isLoading} onPress={handleSave} style={[styles.saveBtn, {}]}>
                            <Text style={styles.saveText}>
                                {isLoading ?
                                    <ActivityIndicator size={"small"} color={"#EEE"} />
                                    : "Save"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    error: {
        color: '#FF0000',
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: "#FFF",
        marginBottom: 14,
        minHeight: 50,
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 12,
    },
    modalInput: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
        minHeight: 90,
    },
    modalActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    cancelBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    cancelText: {
        color: "#888",
        fontSize: 14,
    },
    saveBtn: {
        backgroundColor: "#0c831f",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
    },
    saveText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
});

export default EditAddressField;