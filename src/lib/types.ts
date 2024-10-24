import { ObjectId } from "mongoose";

export type CollectionType = {
  _id: string;
  title: string;
  description: string;
  image: string;
  products: ProductType[];
};

// update all of it after reviews
export type ProductType = {
  _id: string;
  title: string;
  description: string;
  category: string;
  collections: CollectionType[];
  media: string[];
  tags: string[];
  sizes: string[];
  color: string[];
  review: string;
  numberOfReviews: number;
  totalRating: number;
  averageRating: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
};

export type UserType = {
  clerkId: string;
  wishlist: string[];
  createdAt: string;
  updatedAt: string;
};

export type OrderColumnType = {
  _id: string;
  customer: CustomerType;
  products: OrderType;
  totalAmount: number;
  createdAt: string;
};

export type CustomerType = {
  clerkId: string;
  name: string;
  email: string;
};

export type OrderItemType = {
  _id: string;
  title: string;
  product: ProductType;
  quantity: number;
  price: number;
  color: string;
  sizes: string;
};

export type OrderDetailsType = {
  _id: string;
  customer: CustomerType;
  products: number;
  totalAmount: number;
  currency: string;
  createdAt: Date;
  status: "created" | "paid";
  items: OrderItemType[];
};

export type OrderType = {
  _id: string;
  customer: CustomerType;
  cartItems: OrderItemType[];
  amount: number;
  currency: string;
  createdAt: Date;
  status: string;
};

export type ReviewType = {
  _id: string;
  rating: number;
  comment: string;
  customer: CustomerType;
  product: ProductType;
  order: OrderType;
};

export interface CustomersType extends CustomerType {
  orders: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  review: ObjectId[];
}

type PaymentType = {
  paymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
};

export type SingleOrderType = {
  payment: PaymentType;
  _id: string;
  customerClerkId: string;
  orderId: string;
  userId: string;
  customer: CustomerType;
  cartItems: OrderItemType[];
  amount: number;
  currency: string;
  status: "created" | "paid";
  review: ReviewType[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};
