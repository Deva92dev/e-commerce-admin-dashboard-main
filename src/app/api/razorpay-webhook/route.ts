/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import { ConnectDB } from "@/lib/mongoDB";
import Order from "@/lib/models/Order";
import Customer from "@/lib/models/Customer";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const POST = async (req: NextRequest) => {
  try {
    // Get raw body and signature
    const rawBody = await req.text();
    console.log("Received Webhook Payload:", rawBody);
    const signature = req.headers.get("x-razorpay-signature") as string;

    // Generate signature using the webhook secret
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET as string;
    const sig = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    //   Verify the signature
    if (sig !== signature) {
      console.error("Webhook signature verification failed.");
      return NextResponse.json("Invalid signature", { status: 400 });
    }

    //  parse the event
    const event = JSON.parse(rawBody);
    //  Handle different events
    if (event.event === "order.paid") {
      const { order_id, payment_id, signature, amount } = event;
      // Retrieve order details
      const orderDetails = await razorpay.orders.fetch(order_id);
      const paymentDetails = await razorpay.payments.fetch(payment_id);

      const customerInfo = {
        clerkId: orderDetails?.notes?.clerkId,
        email: orderDetails.customer_details?.email,
        name: orderDetails.customer_details?.name,
      };

      const orderItems = orderDetails.line_items?.map((item: any) => ({
        product: item.productId,
        color: item.color || "N/A",
        sizes: item.sizes || "N/A",
        quantity: item.quantity,
      }));

      await ConnectDB();

      // Create or update the order
      const newOrder = new Order({
        orderId: order_id,
        userId: customerInfo.clerkId,
        customer: {
          clerkId: customerInfo.clerkId,
          name: customerInfo.name,
          email: customerInfo.email,
        },
        cartItems: orderItems,
        amount: amount / 100, // in 100 paise
        currency: "INR",
        status: "paid",
        paymentId: payment_id,
        razorpayOrderId: order_id,
        razorpayPaymentId: payment_id,
        razorpaySignature: signature,
      });
      await newOrder.save();

      // Update customer with new order
      let customer = await Customer.findOne({ clerkId: customerInfo.clerkId });
      if (customer) {
        customer.orders.push(newOrder._id);
      } else {
        customer = new Customer({
          ...customerInfo,
          orders: [newOrder._id],
        });
      }
      await customer.save();
    } else if (event.event === "payment.captured") {
      const { order_id, payment_id, signature, amount } = event;
      // Find the order by order_id and update payment details
      const order = await Order.findOne({ razorpayOrderId: order_id });
      if (order) {
        order.status = "captured";
        order.razorpayPaymentId = payment_id;
        order.razorpaySignature = signature;
        await order.save();
      }
    } else if (event.event === "payment.failed") {
      const { order_id, payment_id, signature, amount } = event;
      // Find the order by order_id and update status
      const order = await Order.findOne({ razorpayOrderId: order_id });
      console.log(order);
      if (order) {
        order.status = "failed";
        order.razorpayPaymentId = payment_id;
        order.razorpaySignature = signature;
        await order.save();
      }
    }

    return NextResponse.json("Webhook processed", { status: 200 });
  } catch (error) {
    console.error("[Webhook_API]", error);
    return NextResponse.json("Failed to create order through webhook", {
      status: 500,
    });
  }
};
