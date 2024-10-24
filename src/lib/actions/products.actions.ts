"use server";
import { ProductType } from "../types";

// change for production
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/api";

export const getProducts = async () => {
  try {
    const res = await fetch(`${baseUrl}/products`, {
      method: "GET",
    });
    const products: ProductType[] = await res.json();
    return products;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw error;
  }
};
