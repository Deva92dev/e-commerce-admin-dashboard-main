"use server";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/api";

export const getTotalSale = async () => {
  try {
    const res = await fetch(`${baseUrl}/sales`, {
      method: "GET",
    });
    const sales = await res.json();
    return sales;
  } catch (error) {
    console.error("Failed to fetch order details:", error);
    throw error;
  }
};
