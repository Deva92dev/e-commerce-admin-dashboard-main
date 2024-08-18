"use server";

import { CollectionType, ProductType } from "./types";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const getCollection = async () => {
  const res = await fetch(`${baseUrl}/collections`, {
    method: "GET",
  });
  const collections: CollectionType[] = await res.json();
  return collections;
};

export const getProducts = async () => {
  const res = await fetch(`${baseUrl}/products`, {
    method: "GET",
  });
  const products: ProductType[] = await res.json();
  return products;
};

export const getProductDetails = async (productId: string) => {
  const res = await fetch(`${baseUrl}/products/${productId}`, {
    method: "GET",
  });
  const product: ProductType = await res.json();
  return product;
};
