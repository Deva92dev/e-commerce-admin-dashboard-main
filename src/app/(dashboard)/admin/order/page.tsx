import { DataTable } from "@/components/custom-ui/Data-Table";
import { Separator } from "@/components/ui/separator";
import { columns } from "../../components/orders/OrderColumn";
import { getOrders } from "@/lib/actions";
import { notFound } from "next/navigation";

const OrdersPage = async () => {
  const order = await getOrders();
  // console.log(order);

  if (!order) {
    notFound();
  }

  return (
    <div className="px-10 py-5">
      <h2 className="font-bold text-3xl">Orders</h2>
      <Separator className="bg-gray-600 my-5" />
      <DataTable columns={columns} data={order} searchKey="_id" />
    </div>
  );
};

export default OrdersPage;
