import { storage } from "@/lib/storage";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Linking,
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function HomeScreen() {
  const [address, setAddress] = useState("");
  const [alternatePhone, setAlternatePhone] = useState("");

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
        <TextInput
          style={[styles.input, styles.addressInput]}
          placeholder="Enter your delivery address"
          multiline
          value={address}
          onChangeText={setAddress}
        />

        <Text style={styles.label}>Alternative Phone</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter alternative phone number"
          keyboardType="phone-pad"
          maxLength={10}
          value={alternatePhone}
          onChangeText={setAlternatePhone}
        />

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    margin: 20,
  },
  label: {
    marginHorizontal: 20,
    marginBottom: 8,
    fontSize: 15,
    fontWeight: "600",
    color: "#444",
  },
  input: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  addressInput: {
    height: 100,
    textAlignVertical: "top",
  },
  option: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
  },
  logoutBtn: {
    backgroundColor: "#E53935",
    margin: 20,
    padding: 15,
    borderRadius: 10,
  },
  logoutText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
});