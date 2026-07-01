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
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { storage } from "@/lib/storage";

export default function FoodScreen() {
  const [area_code, setAreaCode] = useState('');
  const [search, setSearch] = useState("");
  const [phone, setPhone] = useState("");
  // const [restaurants, setRestaurants] = useState([]);


  const fetchRestaurants = async () => {
    const { data } = await axios.get(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/restaurants`
    );
    return data;
  };

  const {
    data: restaurants = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["restaurants"],
    queryFn: fetchRestaurants,
    staleTime: 1000 * 60 * 5,
  });

  const [areas, setAreas] = useState([]);
  const [areaLoading, setAreaLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setAreaLoading(true);
    axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/area/all`)
      .then((res) => {
        if (res.status == 200) {
          setAreas(res.data);
          console.log(res.data);
        }
        if (res.status == 404) {
          alert('No Areas Found.')
        }
      })
      .catch(() => alert("Areas fetch Error."))
      .finally(() => setAreaLoading(false));
  }, []);

  // useEffect(() => {
  //   loadRestaurants();
  // }, []);

  // const loadRestaurants = async () => {
  //   try {
  //     setRefreshing(true);
  //     const { data } = await axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/restaurants`);
  //     setRestaurants(data as []);
  //     setRefreshing(false);
  //   } catch (err: any) {
  //     setRefreshing(false);
  //     console.error("Error loading restaurants:", err.message);
  //   }
  // };

  const filtered = restaurants && restaurants.filter((r: { id: string, name: string, area_code: string }) => {
    const matchesSearch = (area_code == "" ? !r.area_code : r.area_code === area_code) && r.name.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const onRefresh = async () => {
    await refetch();
  };

  useEffect(() => {
    storage.getItem('phone').then((_phone: any) => {
      setPhone(_phone);
    })
  }, []);

  if (isLoading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  if (isError) return <Text>{error.message}</Text>;

  return (
    <SafeAreaView style={styles.container}>
      {/* <View style={styles.wrapper}>
        <Text style={styles.welcomeText}>
          👋 Welcome, {"Guest"}
        </Text>
        <View style={styles.dropdown}>
          <Picker
            selectedValue={area_code}
            onValueChange={(val) => {
              setAreaCode(val);
              setOpen(false);
            }}
          >
            <Picker.Item label="Select Location" value="" />

            {areas.map((area: any) => (
              <Picker.Item
                key={area.code}
                label={`${area.code} - ${area.name}`}
                value={area.code}
              />
            ))}
          </Picker>
        </View>
      </View> */}

      <View style={styles.wrapper}>
        <Text style={styles.welcomeText}>
          Delivery To - {phone}
        </Text>
        <View style={styles.dropdown}>
          <Picker
            selectedValue={area_code}
            onValueChange={(val) => {
              setAreaCode(val);
              setOpen(false);
            }}
          >
            <Picker.Item label="Select Location" value="" />

            {areas.map((area: any) => (
              <Picker.Item
                key={area.code}
                label={`${area.code} - ${area.name}`}
                value={area.code}
              />
            ))}
          </Picker>
        </View>
      </View>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Grocery Items..."
        value={search}
        onChangeText={setSearch}
      />
      {isLoading &&
        "Loading..."
      }
      <FlatList
        onRefresh={onRefresh}
        refreshing={isFetching}
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
                pathname: "/home/restaurant/[id]",
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
    width: "32%",
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
    backgroundColor: "#fff",
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
  headerContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  label: {
    fontSize: 12,
    color: "#777",
    marginBottom: 4,
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  arrow: {
    fontSize: 18,
    color: "#111",
  },
  dropdown: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    marginBottom: 15,
  },
  wrapper: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  guestText: {
    color: "#00b37a",
    fontWeight: "800",
  },

  subText: {
    fontSize: 13,
    color: "#777",
    marginTop: 2,
    marginBottom: 10,
  },

  pickerContainer: {
    borderRadius: 12,
    backgroundColor: "#f7f7f7",
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  picker: {
    height: 45,
    color: "#111",
  },
});

