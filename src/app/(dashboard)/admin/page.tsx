import { formatPrice } from "@/lib/formatPrice";

const DashboardPage = async () => {
  const res = await fetch(`http://localhost:3000/api/sales`, {
    method: "GET",
    cache: "no-cache", // Ensures fresh data
  });

  const data = await res.json();
  const totalSales = data.totalSales;

  const response = await fetch(`http://localhost:3000/api/customers`, {
    method: "GET",
    cache: "no-cache",
  });

  const { totalPaidCustomers, customerList } = await response.json();
  console.log(totalPaidCustomers, customerList);

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
