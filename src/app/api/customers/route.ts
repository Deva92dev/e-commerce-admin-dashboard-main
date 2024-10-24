/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Order from "@/lib/models/Order";
import Customer from "@/lib/models/Customer";
import { ConnectDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import Product from "@/lib/models/Product";

export const GET = async (req: NextRequest) => {
  try {
    await ConnectDB();

    // Find all orders with a 'paid' status
    const ordersWithPaidStatus = await Order.find({ status: "paid" })
      .populate({ path: "customer", model: Customer })
      .populate({ path: "cartItems.product", model: Product });

    if (!ordersWithPaidStatus || ordersWithPaidStatus.length === 0) {
      return NextResponse.json(
        { error: "No paid orders found" },
        { status: 404 }
      );
    }

    // Collect unique customer IDs
    const uniqueCustomers = ordersWithPaidStatus.reduce(
      (acc: Record<string, any>, order) => {
        const customerId = order.customer._id.toString();
        if (!acc[customerId]) {
          acc[customerId] = {
            _id: customerId,
            name: order.customer.name,
            email: order.customer.email,
            orders: [],
          };
        }
        acc[customerId].orders.push({
          orderId: order._id,
          products: order.cartItems.map((item: any) => ({
            productId: item.product._id,
            productName: item.product.name,
            quantity: item.quantity,
          })),
          amount: order.amount,
          currency: order.currency,
          createdAt: order.createdAt,
        });
        return acc;
      },
      {}
    );

    // Convert the uniqueCustomers object to an array
    const customerList = Object.values(uniqueCustomers);

    return NextResponse.json(
      { totalPaidCustomers: customerList.length, customerList },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=86400 stale-while-revalidate=3600",
        },
      }
    );
  } catch (error) {
    console.error("[AllPaidCustomers_API]", error);
    return NextResponse.json(
      { error: "Error Fetching Paid Customers" },
      { status: 500 }
    );
  }
};
