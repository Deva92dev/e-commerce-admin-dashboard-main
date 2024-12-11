"use server";
import "whatwg-fetch";

import { currentUser } from "@clerk/nextjs/server";
import {
  CollectionType,
  OrderColumnType,
  OrderDetailsType,
  ProductType,
} from "./types";
import { cookies } from "next/headers";

// change for production
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const getUserDetails = async () => {
  const user = await currentUser();

  if (!user) {
    return { userId: undefined, userName: "", userProfileImage: "" };
  }

  const userId = user?.id;
  const userName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  const userProfileImage = user?.imageUrl;

  return { userId, userName, userProfileImage };
};

export const getCollection = async () => {
  try {
    const res = await fetch(`${baseUrl}/collections`, {
      method: "GET",
      next: {
        revalidate: 1296000, // 15 days
      },
    });
    const collections: CollectionType[] = await res.json();
    return collections;
  } catch (error) {
    console.error("Failed to fetch collections:", error);
    throw error;
  }
};

export const getCollectionDetails = async (collectionId: string) => {
  try {
    const res = await fetch(`${baseUrl}/collections/${collectionId}`, {
      method: "GET",
    });
    if (!res.ok) {
      return null;
    }
    const collection: CollectionType = await res.json();
    return collection;
  } catch (error) {
    console.error("Failed to fetch collections details:", error);
    return null;
  }
};

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

export const getOrderDetails = async (orderId: string) => {
  try {
    const res = await fetch(`${baseUrl}/orders/${orderId}`, {
      method: "GET",
    });
    const order: OrderDetailsType = await res.json();
    return order;
  } catch (error) {
    console.error("Failed to fetch order details:", error);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const res = await fetch(`${baseUrl}/orders`, {
      method: "GET",
    });

    const orders: OrderColumnType[] = await res.json();
    return orders;
  } catch (error) {
    console.error("Failed to fetch Orders:", error);
    throw error;
  }
};

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

export const getProductDetails = async (productId: string) => {
  try {
    const res = await fetch(`${baseUrl}/products/${productId}`, {
      method: "GET",
    });
    if (!res.ok) {
      return null;
    }
    const product: ProductType = await res.json();
    return product;
  } catch (error) {
    console.error("Failed to fetch product details:", error);
    return null;
  }
};

export const getProducts = async () => {
  try {
    const res = await fetch(`${baseUrl}/products`, {
      method: "GET",
      next: {
        revalidate: 1296000, // 15 days
      },
    });
    const products: ProductType[] = await res.json();
    return products;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw error;
  }
};

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

export const getTotalPaidCustomers = async () => {
  try {
    const res = await fetch(`${baseUrl}/customers`, {
      method: "GET",
    });
    const totalPaidCustomers = await res.json();
    return totalPaidCustomers;
  } catch (error) {
    console.error("Failed to fetch order details:", error);
    throw error;
  }
};

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

export const getWishlistProducts = async () => {
  const cookieHeader = await cookies().toString();
  try {
    const res = await fetch(`${baseUrl}/users/wishlist`, {
      method: "GET",
      cache: "no-cache",
      credentials: "include",
      headers: {
        Cookie: cookieHeader,
      },
    });
    const wishlistProduct: ProductType[] = await res.json();
    return wishlistProduct;
  } catch (error) {
    console.error("Failed to fetch wishlist products:", error);
    throw error;
  }
};
