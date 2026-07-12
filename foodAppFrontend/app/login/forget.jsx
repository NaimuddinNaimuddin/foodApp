import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import axios from "axios";
import { signupStyles as styles } from "../../assets/styles/signupStyles";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const Forget = () => {
    const router = useRouter();
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!phone) {
            Toast.show({ type: "error", text1: "Please Enter Phone Number." });
            return;
        }
        if (!password) {
            Toast.show({ type: "error", text1: "Please Enter Password." });
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                `${API_BASE_URL}/users/forget`,
                { phone, password }
            );
            if (response && response.status == 201) {
                Toast.show({ type: "success", text1: response?.data?.message });
                router.replace('/login');
            }
        } catch (error) {
            if (error && error.response && error.response.data) {
                Toast.show({ type: "error", text1: error.response.data?.message });
            } else {
                Toast.show({ type: "error", text1: "Server not Reachable." });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}> Forget Password </Text>

            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={phone}
                keyboardType="phone-pad"
                onChangeText={setPhone}
                maxLength={10}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                maxLength={10}
            />

            <TouchableOpacity disabled={loading} style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>
                    {
                        loading ?
                            <ActivityIndicator size={"small"} color={"#FFF"} />
                            : "Change Password"
                    }
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.navigate("/login")}>
                <Text style={{ marginTop: 15, color: "#ee0000", textAlign: "center" }}>
                    Already have an account? Log in
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default Forget;
