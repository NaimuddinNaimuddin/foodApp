import { FlatList } from "react-native";
import { SelectSkeleton, SkeletonCard } from "./Skeletion";
import { SafeAreaView } from "react-native-safe-area-context";


export default function HomeLoading() {
    return (
        <SafeAreaView style={{
            flex: 1,
            padding: 15,
            backgroundColor: "#fff",
        }}>
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
    )
}