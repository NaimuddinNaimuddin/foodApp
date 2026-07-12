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

const EditAddressField = () => {
    const { user, setUser } = useUser();
    const [tempAddress, setTempAddress] = useState<string | undefined>('');
    const [modalVisible, setModalVisible] = useState(false);

    const { updateUserDetails, isLoading, error } = useUpdateUserDetails();

    const handleSave = async () => {
        const USER_ID = user?.id;
        if (!USER_ID) return;
        if (tempAddress == user?.user_address) return;

        const success = await updateUserDetails({
            user_id: USER_ID,
            user_address: tempAddress,
        });

        if (success) {
            setModalVisible(false);
            setUser({ ...user, user_address: tempAddress });
        }
    };

    const openModal = () => {
        setTempAddress(user?.user_address);
        setModalVisible(true);
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    return (
        <View>
            <View style={styles.row}>
                <TouchableOpacity style={[styles.input, { flex: 1 }]} onPress={openModal}>
                    <TextInput
                        value={user?.user_address || ''}
                        editable={false}
                        pointerEvents="none"
                        multiline
                        numberOfLines={4}
                    />
                </TouchableOpacity>
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
                        <Text style={styles.modalTitle}>Edit Delivery Address</Text>

                        <TextInput
                            style={styles.modalInput}
                            placeholder="Enter delivery address"
                            value={tempAddress}
                            onChangeText={setTempAddress}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            autoFocus
                            autoComplete="tel"
                            maxLength={130}
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
        marginBottom: 14,
        minHeight: 50,
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

export default EditAddressField;