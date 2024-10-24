"use server";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/api";

export const getTotalPaiCustomers = async () => {
  try {
    const res = await fetch(`${baseUrl}/customers`, {
      method: "GET",
    });
    const totalCustomers = await res.json();
    return totalCustomers;
  } catch (error) {
    console.error("Failed to fetch order details:", error);
    throw error;
  }
};
