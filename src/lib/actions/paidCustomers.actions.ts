"use server";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/api";

// changed order of params
export const getPaidCustomers = async (productId: string, userId: string) => {
  try {
    const res = await fetch(`${baseUrl}/customers/${userId}/${productId}`, {
      method: "GET",
      credentials: "include",
    });
    const { totalPaidCustomers, customerOrderData } = await res.json();
    return { totalPaidCustomers, customerOrderData };
  } catch (error) {
    console.error("Failed to fetch Total Paid Customers:", error);
    throw error;
  }
};
