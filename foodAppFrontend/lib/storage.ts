import AsyncStorage from "@react-native-async-storage/async-storage";

export const storage = {
    async setItem(key: string, value: string) {
        return AsyncStorage.setItem(key, JSON.stringify(value));
    },

    async getItem(key: string) {
        return AsyncStorage.getItem(key);
    },

    async removeItem(key: string) {
        return AsyncStorage.removeItem(key);
    },
};