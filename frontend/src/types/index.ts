export interface User {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  unit: "kg" | "lb" | "pack" | "each";
  category: string;
  subcategory?: string;
  stock: number;
  lowStockThreshold: number;
  images: string[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  _id?: string;
  user: string;
  items: CartItem[];
}

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  address: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export interface ComplaintMessage {
  sender: "customer" | "admin";
  senderName: string;
  text: string;
  createdAt: string;
}

export interface Complaint {
  _id: string;
  user: string;
  userName: string;
  subject: string;
  status: "open" | "resolved";
  messages: ComplaintMessage[];
  createdAt: string;
  updatedAt: string;
}
