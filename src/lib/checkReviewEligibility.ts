import { auth } from "@clerk/nextjs/server";
import { ConnectDB } from "./mongoDB";
import Customer from "./models/Customer";
import Order from "./models/Order";

const ReviewEligibility = async (productId: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User is not authenticated");
  }

  await ConnectDB();

  const customer = await Customer.findOne({ clerkId: userId });
  if (!customer) {
    return false; // User is not a customer
  }

  // Check if customer has purchased the product
  const order = await Order.find({
    customer: customer._id,
    "cartItems.product": productId,
    status: "paid",
  });

  return !!order; // Returns true if an order exists, false otherwise
};

export default ReviewEligibility;
