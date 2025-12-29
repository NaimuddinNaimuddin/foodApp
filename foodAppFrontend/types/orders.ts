export interface RestaurantLocation {
  type: "Point";
  coordinates: [number, number];
}

export interface Restaurant {
  _id: string;
  name: string;
  image_url: string;
  category: string;
  ratings: number;
  status: "open" | "closed";
  location: RestaurantLocation;
  createdAt: string;
}

export interface FoodItem {
  _id: string;
  name: string;
  price: number;
  isAvailable: boolean;
  restaurant: Restaurant;
}

export interface OrderItem {
  _id: string;
  quantity: number;
  foodId: FoodItem;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryAddress: string;
  paymentMethod: "COD" | "Online";
  status: "Pending" | "Confirmed" | "Delivered" | "Cancelled";
  createdAt: string;
  updatedAt: string;
}
