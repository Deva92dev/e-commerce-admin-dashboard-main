import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { ConnectDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export const GET = async (
  req: NextRequest,
  props: { params: Promise<{ userId: string; productId: string }> }
) => {
  const params = await props.params;
  try {
    await ConnectDB();

    const productId = mongoose.Types.ObjectId.isValid(params.productId)
      ? new mongoose.Types.ObjectId(params.productId)
      : null;

    if (!productId) {
      return NextResponse.json(
        { error: "Invalid product ID format" },
        { status: 400 }
      );
    }

    const customersWithPaidOrders = await Order.find({
      status: "paid",
      "cartItems.product": params.productId,
    })
      .populate({ path: "customer", model: Customer })
      .populate({ path: "cartItems.product", model: Product });

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      product: order.cartItems.map((item: any) => ({
        productId: item.product._id,
        productName: item.product.name,
        quantity: item.quantity,
      })),
      status: order.status,
    }));

    return NextResponse.json(
      { totalPaidCustomers: uniqueCustomerCount, customerOrderData },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=43200 stale-while-revalidate=3600",
        },
      }
    );
  } catch (error) {
    console.error("[Customers_PaidCount_API]", error);
    return NextResponse.json(
      { error: "Error Fetching Customers Count" },
      { status: 500 }
    );
  }
};
