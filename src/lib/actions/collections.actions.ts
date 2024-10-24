"use server";

import { CollectionType } from "../types";

// change for production
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/api";

export const getCollection = async () => {
  try {
    const res = await fetch(`${baseUrl}/collections`, {
      method: "GET",
    });
    const collections: CollectionType[] = await res.json();
    return collections;
  } catch (error) {
    console.error("Failed to fetch collections:", error);
    throw error;
  }
};
