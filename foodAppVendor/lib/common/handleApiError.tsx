import Toast from "react-native-toast-message";
import { AxiosError } from "axios";

export const handleApiError = (error: unknown, fallbackMessage = "Something went wrong. Please try again.") => {
    let message = fallbackMessage;

    if (error instanceof AxiosError) {
        message = error.response?.data?.message || fallbackMessage;
    } else if (error instanceof Error) {
        message = error.message || fallbackMessage;
    }

    Toast.show({
        type: "error",
        text1: message,
        position: "bottom",
    });

    // still log the raw error for debugging
    console.error("API Error:", error);
    return message;
};