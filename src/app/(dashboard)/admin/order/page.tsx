import { DataTable } from "@/components/custom-ui/Data-Table";
import { Separator } from "@/components/ui/separator";
import { columns } from "../../components/orders/OrderColumn";

const OrdersPage = async () => {
  const res = await fetch(`http://localhost:3000/api/orders`);
  const order = await res.json();

  return (
    <div className="px-10 py-5">
      <h2 className="font-bold text-3xl">Orders</h2>
      <Separator className="bg-gray-600 my-5" />
      <DataTable columns={columns} data={order} searchKey="_id" />
    </div>
  );
};

export default OrdersPage;
