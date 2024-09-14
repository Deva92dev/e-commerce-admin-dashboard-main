"use server";

import {
  CollectionType,
  OrderColumnType,
  OrderItemType,
  ProductType,
} from "./types";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const getCollection = async () => {
  try {
    const res = await fetch(`${baseUrl}/api/collections`, {
      method: "GET",
    });
    const collections: CollectionType[] = await res.json();
    return collections;
  } catch (error) {
    console.error("Failed to fetch collections:", error);
    throw error;
  }
};

export const getProducts = async () => {
  try {
    const res = await fetch(`${baseUrl}/api/products`, {
      method: "GET",
    });
    const products: ProductType[] = await res.json();
    return products;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw error;
  }
};

export const getProductDetails = async (productId: string) => {
  try {
    const res = await fetch(`${baseUrl}/api/products/${productId}`, {
      method: "GET",
    });
    const product: ProductType = await res.json();
    return product;
  } catch (error) {
    console.error("Failed to fetch product details:", error);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const res = await fetch(`${baseUrl}/api/orders`, {
      method: "GET",
    });

    const orders: OrderColumnType[] = await res.json();
    return orders;
  } catch (error) {
    console.error("Failed to fetch Orders:", error);
    throw error;
  }
};

export const getOrderDetails = async (orderId: string) => {
  try {
    const res = await fetch(`${baseUrl}/api/orders/${orderId}`, {
      method: "GET",
    });
    const order: OrderItemType = await res.json();
    console.log(order);
    return order;
  } catch (error) {
    console.error("Failed to fetch order details:", error);
    throw error;
  }
};

export const getPaidCustomers = async (userId: string, productId: string) => {
  try {
    const res = await fetch(`${baseUrl}/api/customers/${userId}/${productId}`, {
      method: "GET",
      credentials: "include",
    });
    const { totalPaidCustomers, customerOrderData } = await res.json();
    return totalPaidCustomers;
  } catch (error) {
    console.error("Failed to fetch Total Paid Customers:", error);
    throw error;
  }
};
