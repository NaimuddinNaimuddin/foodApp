import { QueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

const handleError = (error: { message: any; }) => {
  console.log("API Error:", error);

  Toast.show({
    type: "error",
    text1: "Something went wrong",
    text2: error?.message || "Please try again",
  });
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: handleError,
    },
  },
});