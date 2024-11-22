// All orders from a customer

import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { ConnectDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (
  req: NextRequest,
  {
    params,
  }: {
    params: { customerId: string };
  }
) => {
  try {
    await ConnectDB();

    const orders = await Order.find({
      customerClerkId: params.customerId,
    }).populate({ path: "cartItems.product", model: Product });

    return NextResponse.json(orders, {
      status: 200,
    });
  } catch (error) {
    console.error("[Customer_All_Order_API]", error);
    return NextResponse.json("Error at fetching Your All Orders", {
      status: 500,
    });
  }
};
