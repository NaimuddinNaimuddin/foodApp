import { useState, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL

interface UpdateUserDetailsPayload {
    user_id: string;
    user_address?: string;
    alt_phone?: string;
}

interface UseUpdateUserDetailsReturn {
    updateUserDetails: (payload: UpdateUserDetailsPayload) => Promise<boolean>;
    isLoading: boolean;
    error: string | null;
}

export const useUpdateUserDetails = (): UseUpdateUserDetailsReturn => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateUserDetails = useCallback(
        async (payload: UpdateUserDetailsPayload): Promise<boolean> => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await axios.post(`${API_BASE_URL}/users/edit`, payload);

                if (response.status == 200 || response.status == 201) {
                    setError(null);
                    return true;
                }
                return false;

            } catch (err: any) {
                setError(
                    err?.response?.data?.message || "Something went wrong. Please try again."
                );
                return false;
            } finally {
                setIsLoading(false);
            }
        }, []);

    return { updateUserDetails, isLoading, error };
};