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
import { MaterialIcons } from "@expo/vector-icons";
import { useUpdateUserDetails } from "../hooks/useUpdateUserDetails";
import { useUser } from "@/context/userContext";

const EditPhoneField = () => {
    const { user, setUser } = useUser();
    const [tempPhone, setTempPhone] = useState<string | undefined>("");
    const [modalVisible, setModalVisible] = useState(false);

    const { updateUserDetails, isLoading, error } = useUpdateUserDetails();

    const handleSave = async () => {
        const USER_ID = user?.id;
        if (!USER_ID) return;
        if (user?.alt_phone == tempPhone) return;

        const success = await updateUserDetails({
            user_id: USER_ID,
            alt_phone: tempPhone,
        });

        if (success) {
            setModalVisible(false);
            setUser({ ...user, alt_phone: tempPhone });
        }
    };

    const openModal = () => {
        setTempPhone(user?.alt_phone);
        setModalVisible(true);
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    return (
        <View>
            <View style={styles.row}>
                <TextInput
                    style={[styles.input, { flex: 1 }]}
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={user?.alt_phone}
                    editable={false}
                    pointerEvents="none"
                />
                <TouchableOpacity onPress={openModal} style={styles.editIconBtn}>
                    <MaterialIcons name="edit" size={30} color="#555" />
                </TouchableOpacity>
            </View>

            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={handleCancel}
            >
                <Pressable style={styles.overlay} onPress={handleCancel}>
                    <Pressable style={styles.modalContent} onPress={() => { }}>
                        <Text style={styles.modalTitle}>Edit Alternative Phone</Text>
                        <TextInput
                            style={styles.modalInput}
                            keyboardType="phone-pad"
                            maxLength={10}
                            value={tempPhone}
                            onChangeText={(text) => setTempPhone(text.replace(/[^0-9]/g, ""))}
                            autoFocus
                        />
                        <Text style={styles.error} >{error}</Text>
                        <View style={styles.modalActions}>
                            <TouchableOpacity onPress={handleCancel} style={styles.cancelBtn}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={isLoading} onPress={handleSave} style={styles.saveBtn}>
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
        </View>
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
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: "#f9f9f9",
        marginLeft: 20,
        marginBottom: 12,
    },
    editIconBtn: {
        padding: 8,
        marginBottom: 14,
        marginRight: 20,
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
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
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
        backgroundColor: "#007bff",
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

export default EditPhoneField;