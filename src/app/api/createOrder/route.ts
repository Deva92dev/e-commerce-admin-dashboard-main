/* eslint-disable @typescript-eslint/no-explicit-any */
import Order from "@/lib/models/Order";
import Payment from "@/lib/models/Payment";
import { ConnectDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import Customer from "@/lib/models/Customer";
import Product from "@/lib/models/Product";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    await ConnectDB();
    const { amount, currency, cartItems, customer } = await req.json();
    console.log("Received request payload:", {
      amount,
      currency,
      cartItems,
      customer,
    });
    // Ensure the amount is provided and is a positive number
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount provided" },
        { status: 400 }
      );
    }

    // Find or create the customer in the database
    let existingCustomer = await Customer.findOne({
      clerkId: customer.clerkId,
    });
    if (!existingCustomer) {
      existingCustomer = new Customer({
        clerkId: customer.clerkId,
        name: customer.name,
        email: customer.email,
      });
      await existingCustomer.save();
    }

    const order = await razorpay.orders.create({
      amount,
      currency,
    });

    // Create the new order in MongoDB
    const newOrder = new Order({
      customerClerkId: customer.clerkId,
      userId: userId,
      orderId: order.id,
      customer: existingCustomer._id,
      cartItems: cartItems.map((item: any) => ({
        product: JSON.parse(item.item)._id,
        quantity: item.quantity,
        color: item.color,
        sizes: item.sizes,
      })),
      amount: amount / 100, // Converting paise to INR
      currency: currency || "INR",
      status: "created",
    });

    await newOrder.save();

    // Deduct stock quantity for each product
    for (const item of newOrder.cartItems) {
      const product = await Product.findById(item.product);

      if (!product) {
        return NextResponse.json(
          { error: `Product not found for ID: ${item.product}` },
          { status: 404 }
        );
      }

      if (product.stockQuantity < item.quantity) {
        throw new Error(`Insufficient stock for product ${product.title}`);
      }

      product.stockQuantity -= item.quantity;
      await product.save();
    }

    // Add the new order ID to the customer's orders array
    existingCustomer.orders.push(newOrder._id);
    await existingCustomer.save();

    const payment = new Payment({
      orderId: order.id,
      amount,
      currency,
      status: order.status,
      userId: customer.clerkId,
    });

    await payment.save();

    // Update the order with the Razorpay order ID
    newOrder.orderId = order.id;
    newOrder.payment = {
      paymentId: payment._id,
      razorpayOrderId: order.id,
    };
    await newOrder.save();

    return NextResponse.json(
      { orderId: order.id, mongoOrderId: newOrder._id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Error Creating Order" },
      { status: 500 }
    );
  }
};
