import Order from "@/lib/models/Order";
import { ConnectDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { userId: string; productId: string } }
) => {
  try {
    await ConnectDB();

    const customersWithPaidOrders = await Order.find({
      status: "paid",
      "cartItems.product": params.productId,
    })
      .populate("customer")
      .populate("cartItems.product");

    if (!customersWithPaidOrders || customersWithPaidOrders.length === 0) {
      return NextResponse.json(
        { error: "No paid orders found for this product" },
        { status: 404 }
      );
    }

    // Collect unique customer IDs
    const uniqueCustomerIds = customersWithPaidOrders.reduce((acc, order) => {
      acc[order.customer._id.toString()] = true;
      return acc;
    }, {} as Record<string, boolean>);
    const uniqueCustomerCount = Object.keys(uniqueCustomerIds).length;

    const customerOrderData = customersWithPaidOrders.map((order) => ({
      orderId: order._id,
      customer: {
        name: order.customer.name,
      },
      product: order.cartItems.map((item: any) => ({
        productId: item.product._id,
        productName: item.product.name,
        quantity: item.quantity,
      })),
      status: order.status,
    }));

    return NextResponse.json(
      { totalPaidCustomers: uniqueCustomerCount, customerOrderData },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Customers_PaidCount_API]", error);
    return NextResponse.json(
      { error: "Error Fetching Customers Count" },
      { status: 500 }
    );
  }
};
