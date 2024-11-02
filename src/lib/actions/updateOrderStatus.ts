"use server";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/api";

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const response = await fetch(`${baseUrl}/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      console.error("Failed to update order status:", response.statusText);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    return null;
  }
}
