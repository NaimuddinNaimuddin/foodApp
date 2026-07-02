import React, { useEffect, useState } from "react";
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
import { storage } from "../storage";

const EditPhoneField = () => {
    const [alternatePhone, setAlternatePhone] = useState("");
    const [tempPhone, setTempPhone] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    const { updateUserDetails, isLoading, error } = useUpdateUserDetails();

    const openModal = () => {
        setTempPhone(alternatePhone);
        setModalVisible(true);
    };

    const handleSave = async () => {
        const USER_ID = await storage.getItem("userId");
        if (!USER_ID) return;

        const success = await updateUserDetails({
            user_id: USER_ID,
            alt_phone: tempPhone,
        });

        if (success) {
            setAlternatePhone(tempPhone);
            setModalVisible(false);
            await storage.setItem('alt_phone', tempPhone);
        }
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    useEffect(() => {
        const loadAltPhone = async () => {
            try {
                const alt_phone = await storage.getItem("alt_phone");
                if (alt_phone !== null) {
                    setAlternatePhone(alt_phone);
                }
            } catch (err) {
                console.error("Error loading address from AsyncStorage:", err);
            }
        };

        loadAltPhone();
    }, []);

    return (
        <View>
            <View style={styles.row}>
                <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Enter alternative phone number"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={alternatePhone}
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
                            placeholder="Enter alternative phone number"
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