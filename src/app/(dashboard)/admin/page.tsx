import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { getTotalPaidCustomers, getTotalSale } from "@/lib/actions";

import { formatPrice } from "@/lib/formatPrice";

const DashboardPage = async () => {
  const { totalSales } = await getTotalSale();
  const { customerList } = await getTotalPaidCustomers();
  if (!totalSales || !customerList) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1>Dashboard</h1>
        <Separator />
        <p>Total Sales: {formatPrice(totalSales)}</p>
        <p>Total Paid Customers: {customerList.length} </p>
      </div>
    </div>
  );
};

export default DashboardPage;
