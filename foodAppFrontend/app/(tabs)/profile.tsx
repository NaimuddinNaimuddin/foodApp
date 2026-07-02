import { storage } from "@/lib/storage";
import { router } from "expo-router";
import React from "react";
import {
  Linking,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { styles } from "@/assets/styles/profileStyles";
import EditPhoneField from "@/lib/components/EditPhoneField";
import EditAddressField from "@/lib/components/EditDeliveryAddress";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function HomeScreen() {

  const handleLogout = async () => {
    await storage.removeItem("token");
    await storage.removeItem("userId");
    await storage.removeItem("phone");
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>My Profile</Text>

        <Text style={styles.label}>Delivery Address</Text>
        <EditAddressField />

        <Text style={styles.label}>Alternative Phone</Text>
        <EditPhoneField />

        <TouchableOpacity
          style={styles.option}
          onPress={() =>
            Linking.openURL(`${API_BASE_URL}/privacy-policy`)
          }
        >
          <Text style={styles.optionText}>Privacy Policy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() =>
            Linking.openURL(`${API_BASE_URL}/terms`)
          }
        >
          <Text style={styles.optionText}>Terms & Conditions</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
