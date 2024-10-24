import { getTotalSale } from "@/lib/actions/sales.actions";
import { getTotalPaiCustomers } from "@/lib/actions/totalpaidCustomers.actions";
import { formatPrice } from "@/lib/formatPrice";

const DashboardPage = async () => {
  const { totalSales } = await getTotalSale();
  const { totalPaidCustomers } = await getTotalPaiCustomers();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1>Dashboard</h1>
        <p>Total Sales: {formatPrice(totalSales)}</p>
        <p>Total Paid Customers: {totalPaidCustomers} </p>
      </div>
    </div>
  );
};

export default DashboardPage;
