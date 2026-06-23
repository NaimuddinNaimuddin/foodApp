

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

export default function FoodScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  // const [location, setLocation] = useState("");
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

      {/* <View style={styles.pickerContainer}>
        <Picker selectedValue={location} onValueChange={setLocation}>
          <Picker.Item label="📍 Select Location" value="" />
          <Picker.Item label="New York" value="newyork" />
          <Picker.Item label="London" value="london" />
          <Picker.Item label="Tokyo" value="tokyo" />
        </Picker>
      </View> */}

      <TextInput
        style={styles.searchBar}
        placeholder="Search Grocery Items..."
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        onRefresh={() => loadRestaurants()}
        refreshing={refreshing}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: 8,
        }}
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
            <Image
              source={{ uri: item.image_url }}
              style={styles.image}
            />

            <View style={styles.details}>
              <Text style={styles.category} numberOfLines={1}>
                {item.name}
              </Text>
            </View>

          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "32%", // 3 cards per row
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
  },

  details: {
    padding: 6,
  },

  category: {
    fontSize: 12,
    textAlign: "center",
  },
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
  name: {
    fontSize: 16,
    fontWeight: "600",
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

