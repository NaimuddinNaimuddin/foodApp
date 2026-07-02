import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { storage } from "@/lib/storage";
import { styles } from '@/assets/styles/homeStyles';
import { SkeletonCard, SelectSkeleton } from "@/lib/components/Skeletion";

export default function FoodScreen() {
  const [area_code, setAreaCode] = useState('');
  const [search, setSearch] = useState("");
  const [phone, setPhone] = useState("");

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

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <SelectSkeleton width={'70%'} height={25} style={{
          marginTop: 12,
          borderRadius: 12,
        }} />
        <SelectSkeleton width={'100%'} height={18} style={{
          marginTop: 12,
          borderRadius: 12,
        }} />
        <SelectSkeleton width={'100%'} height={50} style={{
          marginTop: 12,
          borderRadius: 12,
        }} />
        <FlatList
          data={Array.from({ length: 4 })}
          numColumns={3}
          keyExtractor={(_, index) => index.toString()}
          columnWrapperStyle={{
            justifyContent: "space-between",
            paddingHorizontal: 8,
            marginTop: 12,
          }}
          renderItem={() => <SkeletonCard />}
        />
      </SafeAreaView>
    );
  }
  if (isError) return <Text>{error.message}</Text>;

  return (
    <SafeAreaView style={styles.container}>
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
              router.navigate({
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
