"use server";
import "whatwg-fetch";

import { currentUser } from "@clerk/nextjs/server";
import {
  CollectionType,
  OrderColumnType,
  OrderDetailsType,
  ProductType,
} from "./types";

// change for production
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://127.0.0.1:3000";

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
    const res = await fetch(`${baseUrl}/api/collections`, {
      method: "GET",
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
    const res = await fetch(`${baseUrl}/api/collections/${collectionId}`, {
      method: "GET",
      next: {
        revalidate: 604800, // 7 day
      },
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
    const res = await fetch(`${baseUrl}/api/orders/customers/${customerId}`, {
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
    const res = await fetch(`${baseUrl}/api/orders/${orderId}`, {
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
    const res = await fetch(`${baseUrl}/api/orders`, {
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
    const res = await fetch(`${baseUrl}/api/customers/${userId}/${productId}`, {
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
    const res = await fetch(`${baseUrl}/api/products/${productId}`, {
      method: "GET",
      next: {
        revalidate: 60, // 1 minute
      },
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
    const res = await fetch(`${baseUrl}/api/products`, {
      method: "GET",
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
    const res = await fetch(`${baseUrl}/api/products/${productId}/related`, {
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
    const res = await fetch(`${baseUrl}/api/sales`, {
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
    const res = await fetch(`${baseUrl}/api/customers`, {
      method: "GET",
    });
    const { totalCustomers, customerList } = await res.json();
    return { totalCustomers, customerList };
  } catch (error) {
    console.error("Failed to fetch order details:", error);
    throw error;
  }
};

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const response = await fetch(`${baseUrl}/api/orders/${orderId}`, {
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
