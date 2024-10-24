// All orders from a customer

import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { ConnectDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  props: { params: Promise<{ customerId: string }> }
) => {
  const params = await props.params;
  try {
    await ConnectDB();

    const orders = await Order.find({
      customerClerkId: params.customerId,
    }).populate({ path: "cartItems.product", model: Product });

    return NextResponse.json(orders, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=43200 stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("[Customer_All_Order_API]", error);
    return NextResponse.json("Error at fetching Your All Orders", {
      status: 500,
    });
  }
};
