"use server";

import {
  CollectionType,
  OrderColumnType,
  OrderItemType,
  ProductType,
} from "./types";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

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
  const res = await fetch(`${baseUrl}/api/collections/${collectionId}`, {
    method: "GET",
  });
  const collection: CollectionType = await res.json();
  return collection;
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

export const getProductDetails = async (productId: string) => {
  try {
    const res = await fetch(`${baseUrl}/api/products/${productId}`, {
      method: "GET",
    });
    const product: ProductType = await res.json();
    return product;
  } catch (error) {
    console.error("Failed to fetch product details:", error);
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

export const getOrderDetails = async (orderId: string) => {
  try {
    const res = await fetch(`${baseUrl}/api/orders/${orderId}`, {
      method: "GET",
    });
    const order: OrderItemType = await res.json();
    console.log(order);
    return order;
  } catch (error) {
    console.error("Failed to fetch order details:", error);
    throw error;
  }
};

export const getPaidCustomers = async (userId: string, productId: string) => {
  try {
    const res = await fetch(`${baseUrl}/api/customers/${userId}/${productId}`, {
      method: "GET",
      credentials: "include",
    });
    const { totalPaidCustomers, customerOrderData } = await res.json();
    return totalPaidCustomers;
  } catch (error) {
    console.error("Failed to fetch Total Paid Customers:", error);
    throw error;
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

// export const getTotalSales = async () => {
//   await ConnectDB();
//   const orders = await Order.find({});
//   const totalOrders = orders.length;
//   const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
//   console.log(totalOrders, totalRevenue);
//   return { totalOrders, totalRevenue };
// };

// export const getSalesPerMonth = async () => {
//   await ConnectDB();
//   const orders = await Order.find({});

//   // acc here is an array of 12 months
//   const salesPerMonth = orders.reduce((acc, order) => {
//     const monthIndex = new Date(order.createdAt).getMonth();
//     acc[monthIndex] = (acc[monthIndex] || 0) + order.totalAmount; // 0-Jan, 11-Dec
//   }, {});

//   const graphData = Array.from({ length: 12 }, (_, i) => {
//     const month = new Intl.DateTimeFormat("en-us", { month: "short" }).format(
//       new Date(0, i)
//     );

//     return { name: month, sales: salesPerMonth[i] || 0 };
//   });
// };
