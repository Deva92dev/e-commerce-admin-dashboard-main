/* eslint-disable @typescript-eslint/no-unused-vars */
import Order from "@/lib/models/Order";
import { ConnectDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await ConnectDB();

    // Aggregate the total sales where the status is "paid"
    const totalSalesResult = await Order.aggregate([
      {
        $match: {
          status: "paid",
        },
      },
      {
        $group: {
          _id: null,
          totalSales: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const totalSales =
      totalSalesResult.length > 0 ? totalSalesResult[0].totalSales : 0;

    return NextResponse.json(
      { totalSales },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=86400 stale-while-revalidate=3600",
        },
      }
    );
  } catch (error) {
    console.error("[Total_Sales_API]", error);
    return NextResponse.json(
      { error: "Error Fetching Total Sales" },
      { status: 500 }
    );
  }
};
