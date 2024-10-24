import { getOrderDetails } from "@/lib/actions/orderDetails.actions";
import { formatPrice } from "@/lib/formatPrice";
import { OrderItemType } from "@/lib/types";

const OrderDetails = async (props: { params: Promise<{ orderId: string }> }) => {
  const params = await props.params;
  const orderDetails = await getOrderDetails(params.orderId);

  return (
    <div className="flex flex-col gap-5 p-10">
      <p className="font-bold">
        Order ID:
        <span className="text-sm text-gray-900 font-normal">
          {orderDetails._id}
        </span>
      </p>
      <p className="font-bold">
        Customer Name:
        <span className="text-sm text-gray-900 font-normal">
          {orderDetails.customer.name}
        </span>
      </p>
      <p className="font-bold">
        Customer Email:
        <span className="text-sm text-gray-900 font-normal">
          {orderDetails.customer.email}
        </span>
      </p>
      <p className="font-bold">
        Order Status:
        <span className="text-sm text-gray-900 font-normal">
          {orderDetails.status}
        </span>
      </p>
      <p className="font-bold">
        Total Amount:
        <span className="text-sm text-gray-900 font-normal">
          {formatPrice(orderDetails.totalAmount)}
        </span>
      </p>
      <p className="font-bold">
        Currency:
        <span className="text-sm text-gray-900 font-normal">
          {orderDetails.currency}
        </span>
      </p>
      <p className="font-bold">
        Created At:
        <span className="text-sm text-gray-900 font-normal">
          {new Date(orderDetails.createdAt).toLocaleDateString()}
        </span>
      </p>

      <div className="mt-4">
        <p className="font-bold mb-2">Products:</p>
        {orderDetails.items &&
          orderDetails.items.map((item: OrderItemType, index: number) => (
            <div key={index} className="border p-4 mb-4">
              <p>
                <span className="font-bold">Product Name: </span>
                {item.title}
              </p>
              <p>
                <span className="font-bold">Quantity: </span> {item.quantity}
              </p>
              <p>
                <span className="font-bold">ProductId: </span> {item._id}
              </p>
              <p>
                <span className="font-bold">Price: </span>
                {formatPrice(item.price)}
              </p>
              <p>
                <span className="font-bold">Color: </span> {item.color}
              </p>
              <p>
                <span className="font-bold">Size(s): </span>
                {item.sizes}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default OrderDetails;
