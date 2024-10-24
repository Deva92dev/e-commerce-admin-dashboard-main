"use server";

import { OrderColumnType } from "../types";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/api";

export const getOrders = async () => {
  try {
    const res = await fetch(`${baseUrl}/orders`, {
      method: "GET",
    });

    const orders: OrderColumnType[] = await res.json();
    return orders;
  } catch (error) {
    console.error("Failed to fetch Orders:", error);
    throw error;
  }
};
