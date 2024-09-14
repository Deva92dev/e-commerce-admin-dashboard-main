import Order from "@/lib/models/Order";
import { ConnectDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { orderId: string } }
) => {
  try {
    await ConnectDB();

    // Fetch the order by ID and populate related fields
    const orderDetails = await Order.findById(params.orderId)
      .populate({ path: "customer", select: "name email" })
      .populate({ path: "cartItems.product", select: "title price _id" });

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
      items: orderDetails.cartItems.map((item: any) => ({
        _id: item.product._id,
        title: item.product.title,
        quantity: item.quantity,
        price: item.product.price,
        color: item.color,
        sizes: item.sizes,
      })),
    };

    console.log("FormattedOrderIdDetails", formattedOrderDetails);

    return NextResponse.json(formattedOrderDetails, { status: 200 });
  } catch (error) {
    console.error("[OrderId_GET]", error);
    return NextResponse.json("Error in Fetching OrderId", { status: 500 });
  }
};
