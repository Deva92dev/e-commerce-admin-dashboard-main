import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import { ConnectDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import { format } from "date-fns";

export const GET = async (req: NextRequest) => {
  try {
    await ConnectDB();

    const orders = await Order.find({}).sort({ createdAt: "desc" });
    const orderDetails = await Promise.all(
      orders.map(async (order) => {
        const customer = await Customer.findOne({
          clerkId: order.customerClerkId,
        });
        return {
          _id: order.id,
          customer: customer.name,
          products: order.products.length,
          totalAmount: order.totalAmount,
          createdAt: format(order.createdAt, "MMM do, yyyy"),
        };
      })
    );

    console.log("Orders:", orderDetails);

    return NextResponse.json(orderDetails, { status: 200 });
  } catch (error: any) {
    console.log("[Orders_API]", error);
    return NextResponse.json(
      { error: "Error Getting Orders", details: error.message },
      { status: 500 }
    );
  }
};
