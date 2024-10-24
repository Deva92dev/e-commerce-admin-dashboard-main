"use server";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/api";

export const getRelatedProducts = async (productId: string) => {
  try {
    const res = await fetch(`${baseUrl}/products/${productId}/related`, {
      method: "GET",
    });
    const relatedProducts = await res.json();
    return relatedProducts;
  } catch (error) {
    console.error("Failed to fetch Orders:", error);
    throw error;
  }
};
