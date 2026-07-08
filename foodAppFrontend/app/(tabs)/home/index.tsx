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
  Dimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { storage } from "@/lib/storage";
import { styles } from '@/assets/styles/homeStyles';
import Toast from "react-native-toast-message";
import { Category } from "@/lib/types/home";
import Carousel, { Pagination } from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import HomeLoading from "@/lib/components/HomeLoading";

const { width } = Dimensions.get("window");

export default function FoodScreen() {

  const [areaId, setAreaId] = useState('');
  const [search, setSearch] = useState("");
  const [phone, setPhone] = useState("");
  const progress = useSharedValue(0);

  const fetchHomeCategories = async (_areaId: string) => {
    const { data } = await axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/restaurants/by-area-code/grouped/${_areaId}`);
    return data;
  };

  const fetchAreas = async () => {
    const { data } = await axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/area/all`);
    return data;
  };

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["restaurants", areaId],
    queryFn: () => fetchHomeCategories(areaId as string),
    staleTime: 1000 * 60 * 10, // 10 min
    enabled: !!areaId, // waits until state is populated (not null)
  });

  const {
    data: areas = [],
  } = useQuery({
    queryKey: ["areas"],
    queryFn: fetchAreas,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  const filteredCategories = data && data.categories && data.categories.length > 0 &&
    data.categories.filter((c: Category) => c.name.toLowerCase().includes(search.toLowerCase())) || [];

  const onRefresh = async () => {
    await refetch();
  };

  useEffect(() => {
    storage.getItem('phone').then((_phone: any) => {
      setPhone(_phone);
    })
    storage.getItem('areaId').then((_areaId: any) => {
      setAreaId(_areaId);
    })
  }, []);

  if (isLoading) {
    return <HomeLoading />;
  }

  if (isError) {
    Toast.show({ type: 'error', text1: error.message || "Something Went Wrong." })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.welcomeText}>
          Delivery To - {phone}
        </Text>
        <View style={styles.dropdown}>
          <Picker
            selectedValue={areaId}
            onValueChange={(val) => {
              setAreaId(val);
              storage.setItem('areaId', val)
            }}
          >
            <Picker.Item label="Select Location" value="" />
            {areas && areas.length > 0 && areas.map((area: any) => (
              <Picker.Item
                key={area.code}
                label={`${area.name} - ${area.code}`}
                value={area._id}
              />
            ))}
          </Picker>
            </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search Grocery Items..."
          value={search}
          onChangeText={setSearch}
        />
        {data && data.banners && data.banners.length > 0 &&
          <View style={{ marginBottom: 10, marginTop: 10 }}>
            <Carousel
              width={width}
              height={180}
              data={data.banners}
              loop
              onProgressChange={progress}
              autoPlay
              snapEnabled
              autoPlayInterval={3000}
              scrollAnimationDuration={800}
              renderItem={({ item }: { item: Category }) => (
                <Pressable
                  onPress={() =>
                    router.navigate({
                      pathname: "/home/restaurant/[id]",
                      params: { id: item._id },
                    })
                  }
                >
                  <Image
                    source={{ uri: item.image_url }}
                    style={{
                      width: width * 0.92,
                      height: 180,
                      borderRadius: 12,
                    }}
                    resizeMode="cover"
                  />
                </Pressable>
              )}
            />
            <Pagination.Custom
              progress={progress}
              data={data.banners}
              dotStyle={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: "#D1D5DB",
                marginHorizontal: 4,
                marginVertical: 10,
              }}
              activeDotStyle={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: "#FF0000",
                marginHorizontal: 4,
                marginVertical: 10,
              }}
            />
          </View>
        }
        <FlatList
          onRefresh={onRefresh}
          refreshing={isFetching}
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: "space-between",
            paddingHorizontal: 0,
          }}
          data={filteredCategories}
          keyExtractor={(item: { _id: string, name: string, image_url: string }) => item._id}
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
      </ScrollView>
    </SafeAreaView>
  );
}
