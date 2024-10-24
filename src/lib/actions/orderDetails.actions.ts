"use server";

import { OrderDetailsType } from "../types";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/api";

export const getOrderDetails = async (orderId: string) => {
  try {
    const res = await fetch(`${baseUrl}/orders/${orderId}`, {
      method: "GET",
    });
    const order: OrderDetailsType = await res.json();
    console.log(order);
    return order;
  } catch (error) {
    console.error("Failed to fetch order details:", error);
    throw error;
  }
};
