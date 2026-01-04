

import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
// import { HelloWave } from "@/components/hello-wave";

export default function FoodScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      setRefreshing(true);
      const { data } = await axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/restaurants`);
      setRestaurants(data as []);
      setRefreshing(false);
    } catch (err: any) {
      setRefreshing(false);
      console.error("Error loading restaurants:", err.message);
    }
  };

  const filtered = restaurants.filter((r: { id: string, name: string, }) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.pickerContainer}>
        <Picker selectedValue={location} onValueChange={setLocation}>
          <Picker.Item label="📍 Select Location" value="" />
          <Picker.Item label="New York" value="newyork" />
          <Picker.Item label="London" value="london" />
          <Picker.Item label="Tokyo" value="tokyo" />
        </Picker>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="Search restaurants..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        onRefresh={() => loadRestaurants()}
        refreshing={refreshing}
        data={filtered}
        keyExtractor={(item: { _id: string, name: string, image_url: string, ratings: string, status: string, category: string }) => item._id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/restaurant/[id]",
                params: { id: item._id },
              })
            }
          >
            <View style={styles.card}>
              <Image
                source={{ uri: item.image_url }}
                style={styles.image}
              />

              <View style={styles.details}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.category}>{item.category}</Text>

                <View style={styles.row}>
                  <Text style={styles.rating}>⭐ {item.ratings}</Text>
                  <Text style={styles.status}>{item.status}</Text>
                </View>
              </View>
            </View>

          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f2f2f2",
  },

  searchBar: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },

  pickerContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    overflow: "hidden",
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },

  locationText: {
    marginTop: 6,
    fontSize: 13,
    color: "#777",
    textTransform: "capitalize",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 14,
    color: "#999",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginVertical: 4,
    marginHorizontal: 2,
    borderRadius: 7,
    padding: 2
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 7,
  },
  details: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  category: {
    fontSize: 16,
    fontWeight: "500",
    color: "#999"
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  rating: {
    fontSize: 14,
    color: "#FFEB3B",
    marginRight: 20,
  },
  status: {
    fontSize: 12,
    color: "#00dd00",
    textTransform: "capitalize"
  },
});

