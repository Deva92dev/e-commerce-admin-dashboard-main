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
        select: "title price _id stockQuantity",
      });

    if (!orderDetails) {
      return NextResponse.json("Order Details Not Found", { status: 404 });
    }

    // Check if the order status is paid, and reduce stock quantity

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
        stockQuantity: item.product.stockQuantity,
      })),
    };

    return NextResponse.json(formattedOrderDetails, {
      status: 200,
    });
  } catch (error) {
    console.error("[OrderId_GET]", error);
    return NextResponse.json("Error in Fetching OrderId", { status: 500 });
  }
};

export const PATCH = async (
  req: NextRequest,
  props: { params: Promise<{ orderId: string }> }
) => {
  const { orderId } = await props.params;
  const { status } = await req.json();

  try {
    await ConnectDB();

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json("Order Not Found", { status: 404 });
    }

    if (order.status === "paid") {
      return NextResponse.json("Order is already paid", { status: 400 });
    }

    if (status === "paid") {
      // for each product
      for (const item of order.cartItems) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stockQuantity = Math.max(
            0,
            product.stockQuantity - item.quantity
          );
          await product.save();
        }
      }

      order.status = "paid";
      await order.save();
    }

    return NextResponse.json("Order status updated and stock adjusted", {
      status: 200,
    });
  } catch (error) {
    console.error("[OrderId_PATCH]", error);
    return NextResponse.json("Error updating order and reducing stock", {
      status: 500,
    });
  }
};
