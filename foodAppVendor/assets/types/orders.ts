import { OrderStatus } from "@/lib/constant";

export interface OrderItem {
  _id: string;
  quantity: number;
  foodId: Food;
}

export interface UserId {
  alt_phone: string;
  user_address: string;
}

export interface Order {
  _id: string;
  userId: string | UserId;
  items: OrderItem[];
  totalAmount: number;
  deliveryAddress: string;
  deliveryPhone: string;
  paymentMethod: "COD" | "Online";
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Food {
  _id: string;
  name: string;
  price: number;
  mrp: number;
  quantity_info: string;
  short_desc?: string;
  image_url?: string;
}

export interface CategoryGroup {
  category: string;
  items: Food[];
}
