"use server";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/api";

export const getCustomerOrders = async (customerId: string) => {
  try {
    const res = await fetch(`${baseUrl}/orders/customers/${customerId}`, {
      method: "GET",
    });
    const orders = await res.json();
    return orders;
  } catch (error) {
    console.error("Failed to fetch Orders:", error);
    throw error;
  }
};
