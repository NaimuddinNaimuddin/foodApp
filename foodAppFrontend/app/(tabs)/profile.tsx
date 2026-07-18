import { storage } from "@/lib/storage";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Linking,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { styles } from "@/assets/styles/profileStyles";
import EditAddressField from "@/lib/components/EditDeliveryAddress";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@/context/userContext";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function HomeScreen() {
  const { logout, user } = useUser();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const handleLogout = async () => {
    setMenuVisible(false);
    await storage.removeItem("token");
    logout();
    router.replace("/login");
  };

  const openModal = () => {
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Header row with title + three-dot menu */}
        <View style={localStyles.headerRow}>
          <Text style={styles.heading}>Welcome - {user?.phone}</Text>

          <TouchableOpacity
            onPress={() => setMenuVisible(true)}
            style={localStyles.menuBtn}
          >
            <Ionicons name="ellipsis-vertical" size={22} color="#333" />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Delivery Address</Text>
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

          <Text style={styles.label}>Delivery Phone</Text>
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
          {modalVisible &&
            <EditAddressField
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
            />
          }
        </View>

        <TouchableOpacity
          style={styles.option}
          onPress={() => Linking.openURL(`${API_BASE_URL}/privacy-policy`)}
        >
          <Text style={styles.optionText}>Privacy Policy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => Linking.openURL(`${API_BASE_URL}/terms`)}
        >
          <Text style={styles.optionText}>Terms & Conditions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => Linking.openURL(`${API_BASE_URL}/refund-policy`)}
        >
          <Text style={styles.optionText}>Refund & Return Policy </Text>
        </TouchableOpacity>

        {/* Logout modal */}
        {menuVisible &&
          <Modal
            visible={menuVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setMenuVisible(false)}
          >
            <Pressable
              style={localStyles.overlay}
              onPress={() => setMenuVisible(false)}
            >
              <View style={localStyles.dropdown}>
                <TouchableOpacity
                  style={localStyles.dropdownItem}
                  onPress={handleLogout}
                >
                  <Ionicons name="log-out-outline" size={18} color="#e74c3c" />
                  <Text style={localStyles.dropdownItemText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Modal>}
      </View>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 3,
    backgroundColor: "#FFF",
    marginBottom: 16,
  },
  menuBtn: {
    padding: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  dropdown: {
    position: "absolute",
    top: 45,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 6,
    minWidth: 140,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  dropdownItemText: {
    marginLeft: 8,
    fontSize: 15,
    color: "#e74c3c",
    fontWeight: "500",
  },
});