import { storage } from '@/lib/storage';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function HomeScreen() {

  const handlePress = async () => {
    await storage.removeItem("token");
    await storage.removeItem("userId");
    await storage.removeItem("phone");
    router.replace('/login');
  }

  return (
    <>
      <Text> This is Home page</Text>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    margin: 15,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});