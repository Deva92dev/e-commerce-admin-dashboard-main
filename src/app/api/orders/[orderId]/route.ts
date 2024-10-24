import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { ConnectDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  props: { params: Promise<{ orderId: string }> }
) => {
  const params = await props.params;
  try {
    await ConnectDB();

    // Fetch the order by ID and populate related fields
    const orderDetails = await Order.findById(params.orderId)
      .populate({ path: "customer", model: Customer, select: "name email" })
      .populate({
        path: "cartItems.product",
        model: Product,
        select: "title price _id",
      });

    if (!orderDetails) {
      return NextResponse.json("Order Details Not Found", { status: 404 });
    }

    // Format the order details
    const formattedOrderDetails = {
      _id: orderDetails._id,
      customer: {
        name: orderDetails.customer.name,
        email: orderDetails.customer.email,
      },
      products: orderDetails.cartItems.length,
      totalAmount: orderDetails.amount,
      currency: orderDetails.currency,
      createdAt: orderDetails.createdAt,
      status: orderDetails.status,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items: orderDetails.cartItems.map((item: any) => ({
        _id: item.product._id,
        title: item.product.title,
        quantity: item.quantity,
        price: item.product.price,
        color: item.color,
        sizes: item.sizes,
      })),
    };

    return NextResponse.json(formattedOrderDetails, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=43200 stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("[OrderId_GET]", error);
    return NextResponse.json("Error in Fetching OrderId", { status: 500 });
  }
};
