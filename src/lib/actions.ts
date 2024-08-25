"use server";

import { CollectionType, OrderColumnType, ProductType } from "./types";

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
