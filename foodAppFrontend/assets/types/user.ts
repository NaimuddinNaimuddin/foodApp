export interface User {
    _id?: string;
    phone: string;
    user_address?: string;
    alt_phone?: string;
    is_phone_verified?: boolean;
    is_address_verified?: boolean;
}