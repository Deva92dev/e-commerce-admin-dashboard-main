/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import Image from "next/image";

import { formatPrice } from "@/lib/formatPrice";
import { OrderItemType, SingleOrderType } from "@/lib/types";
import { getCustomerOrders } from "@/lib/actions";

export const metadata: Metadata = {
  title: "Orders - Own Closet",
};

// orders related to clerk user, that's why userId in as parameter
const OrdersPage = async (props: {
  params: Promise<{ customerId: string }>;
}) => {
  const params = await props.params;
  const { userId } = auth();

  const getCustomerAllOrders: SingleOrderType[] = await getCustomerOrders(
    userId as string
  );
  const paidOrders = getCustomerAllOrders.filter(
    (order: any) => order.status === "paid"
  );

  return (
    <div className="px-4 md:px-6 lg:px-12 xl:px-24 ">
      <h2 className="my-5 font-bold text-3xl">Your Orders </h2>
      {paidOrders.length === 0 && <p className="py-5">You have no order yet</p>}
      <div className="grid gap-4">
        {paidOrders.map((order) => (
          <div key={order._id} className="hover:bg-gray-100 rounded-lg py-4">
            <div className="flex gap-8 pb-2 max-md:flex-col max-md:gap-2">
              <p className="font-normal">Order Id: {order._id}</p>
              <p className="font-normal">
                Total Amount: {formatPrice(order.amount)}
              </p>
            </div>
            <div className="">
              {order.cartItems.map((orderItem: OrderItemType) => (
                <div key={orderItem._id} className="flex flex-row gap-2">
                  <Image
                    src={orderItem.product.media[0]}
                    alt={orderItem.product.title}
                    width={100}
                    height={100}
                    className="h-32 w-32 object-cover rounded-lg"
                  />
                  <div className="flex flex-col justify-between">
                    <p>
                      Title :
                      <span className="font-bold pl-2">
                        {orderItem.product.title}
                      </span>
                    </p>
                    {orderItem.color && (
                      <p>
                        Color :
                        <span className="font-bold pl-2">
                          {orderItem.color}
                        </span>
                      </p>
                    )}
                    {orderItem.sizes && (
                      <p>
                        Sizes :
                        <span className="font-bold pl-2">
                          {orderItem.sizes}
                        </span>
                      </p>
                    )}

                    <p>
                      Quantity :
                      <span className="font-bold pl-2">
                        {orderItem.quantity}
                      </span>
                    </p>
                    <p>
                      Price :
                      <span className="font-bold pl-2">
                        {orderItem.product.price}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
