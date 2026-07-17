import { router } from "expo-router";
import { useState } from "react";
import {
    FlatList,
    Pressable,
    Text,
    TextInput,
    View,
    Image,
    Dimensions,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { styles } from '@/assets/styles/homeStyles';
import Toast from "react-native-toast-message";
// import { Category } from "@/lib/types/home";
import Carousel, { Pagination } from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
// import HomeLoading from "@/lib/components/HomeLoading";
import { useUser } from "@/context/userContext";

const { width } = Dimensions.get("window");

export default function FoodScreen() {
    const progress = useSharedValue(0);
    const { user } = useUser();
    const [search, setSearch] = useState("");

    const fetchHomeCategories = async (_areaId: string) => {
        const { data } = await axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/restaurants/by-area-code/grouped/${_areaId}`);
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
        queryKey: ["restaurants", user?.area_id],
        queryFn: () => fetchHomeCategories(user?.area_id as string),
        staleTime: 1000 * 60 * 10, // 10 min
        enabled: !!user?.area_id, // waits until state is populated (not null)
    });

    const filteredCategories = data && data.categories && data.categories.length > 0 &&
        data.categories.filter((c: any) => c.name.toLowerCase().includes(search.toLowerCase())) || [];

    const onRefresh = async () => {
        await refetch();
    };

    if (isLoading) {
        return <ActivityIndicator size={"large"} color={"#FF0000"} />;
    }
    if (isError) {
        Toast.show({ type: 'error', text1: error.message || "Something Went Wrong." })
    }
    return (
        <SafeAreaView style={styles.container}>
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
                            renderItem={({ item }: { item: any }) => (
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
        </SafeAreaView >
    );
}
