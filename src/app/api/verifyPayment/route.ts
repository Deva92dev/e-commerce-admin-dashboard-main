/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import { ConnectDB } from "@/lib/mongoDB";
import Payment from "@/lib/models/Payment";
import Order from "@/lib/models/Order";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }
    ConnectDB();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cartItems,
      customerId,
    } = await req.json();

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !customerId ||
      !cartItems
    ) {
      return NextResponse.json(
        {
          message: "Necessary credentials are missing",
          success: false,
        },
        { status: 400 }
      );
    }

    const order = await Order.findOne({ orderId: razorpay_order_id });
    if (!order) {
      console.error("Order not found:", razorpay_order_id);
      return NextResponse.json({ error: "Order not found" }, { status: 400 });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("Payment verification failed: Invalid signature");
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    // Update the order status and payment details in the database
    order.status = "paid";
    order.payment = {
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      razorpaySignature: razorpay_signature,
    };
    await order.save();

    // Also, update the Payment model if needed
    await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        paymentId: razorpay_payment_id,
        status: "paid",
      }
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[Payment_Verification_API]", error);
    return NextResponse.json("Payment_Verification failed", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
