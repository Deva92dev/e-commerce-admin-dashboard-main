import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const POST = async (req: NextRequest) => {
  try {
    const { cartItems, customer } = await req.json();

    const order = await razorpay.orders.create({
      amount: 100 * 100, // in paise
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
      notes: {
        cartItems: JSON.stringify(cartItems),
        customer: JSON.stringify(customer),
      },
    });

    return NextResponse.json({ orderId: order.id }, { status: 200 });
  } catch (error) {
    console.error("RAZORPAY_API", error);
    return NextResponse.json(
      { error: "Error Creating Order" },
      { status: 500 }
    );
  }
};
