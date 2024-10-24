"use server";

import { CollectionType } from "../types";

// change for production
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/api";

export const getCollectionDetails = async (collectionId: string) => {
  try {
    const res = await fetch(`${baseUrl}/collections/${collectionId}`, {
      method: "GET",
    });
    const collection: CollectionType = await res.json();
    return collection;
  } catch (error) {
    console.error("Failed to fetch collections details:", error);
    throw error;
  }
};
