import { jwtDecode } from "jwt-decode";

export const isTokenValid = (token: string | null) => {
    if (!token) return false;

    try {
        const decoded: any = jwtDecode(token);

        // exp is in seconds
        if (decoded.exp * 1000 < Date.now()) {
            return false; // expired
        }

        return true;
    } catch (e) {
        return false;
    }
};