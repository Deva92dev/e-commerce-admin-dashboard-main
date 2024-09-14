import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
  typescript: true,
});

export const POST = async (req: NextRequest) => {
  try {
    const { cartItems, customer } = await req.json();
    if (!cartItems || !customer) {
      return NextResponse.json("Not Enough Data to Create Order", {
        status: 400,
      });
    }

    // all these things you can get from the stripe checkout api page
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["IN", "AC", "US", "EG"],
      },
      shipping_options: [{ shipping_rate: "shr_1PqKUeSHLg2msKkI1aaWM9GK" }],
      line_items: cartItems.map((cartItem: any) => ({
        price_data: {
          currency: "INR",
          product_data: {
            name: cartItem.item.title,
            metadata: {
              productId: cartItem.item.id,
              ...(cartItem.sizes && { sizes: cartItem.sizes }),
              ...(cartItem.color && { color: cartItem.color }),
            },
          },
          unit_amount: cartItem.item.price * 100,
        },
        quantity: cartItem.quantity,
      })),
      client_reference_id: customer.clerkId,
      // change them when you deploy
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment_success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
    });

    return NextResponse.json(session, { status: 200 });
  } catch (error) {
    console.log(["Checkout_API"], error);
    return NextResponse.json("Error creating Payment", { status: 500 });
  }
};
