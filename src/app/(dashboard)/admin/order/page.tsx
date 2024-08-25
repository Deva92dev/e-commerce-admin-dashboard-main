import { getOrders } from "@/lib/actions";

const OrdersPage = async () => {
  try {
    const orders = await getOrders();
    console.log("Orders:", orders);
    return (
      <div>
        <h1>Orders</h1>
        {orders.map((order) => (
          <div key={order._id}>
            {order.customer} - {order.totalAmount}
          </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error in OrdersPage:", error);
    return (
      <div className="text-7xl font-extrabold">
        Error loading orders. Please try again later.
      </div>
    );
  }
};

export default OrdersPage;
