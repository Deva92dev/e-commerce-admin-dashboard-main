import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import { ConnectDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import { format } from "date-fns";

export const GET = async (req: NextRequest) => {
  try {
    await ConnectDB();

    const orders = await Order.find({})
      .populate("customer", "name email")
      .populate("cartItems.product", "title price")
      .sort({ createdAt: "desc" });

    // Format and return order details
    const orderDetails = orders.map((order) => ({
      _id: order._id,
      customer: order.customer.name,
      email: order.customer.email,
      products: order.cartItems.length,
      totalAmount: order.amount,
      currency: order.currency,
      createdAt: format(order.createdAt, "MMM do, yyyy"),
      status: order.status,
      items: order.cartItems.map((item: any) => ({
        title: item.product.title,
        quantity: item.quantity,
        price: item.product.price,
        color: item.color,
        sizes: item.sizes,
      })),
    }));

    return NextResponse.json(orderDetails, { status: 200 });
  } catch (error: any) {
    console.log("[Orders_API]", error);
    return NextResponse.json(
      { error: "Error Getting Orders", details: error.message },
      { status: 500 }
    );
  }
};
