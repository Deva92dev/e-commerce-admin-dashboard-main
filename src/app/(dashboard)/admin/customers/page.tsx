/* eslint-disable @typescript-eslint/no-explicit-any */
import { Separator } from "@/components/ui/separator";
import { getTotalPaidCustomers } from "@/lib/actions";
import { notFound } from "next/navigation";

const CustomersPage = async () => {
  const { customerList } = await getTotalPaidCustomers();
  if (!customerList) {
    notFound();
  }

  return (
    <div className="px-10 py-5">
      <h2 className="font-bold text-3xl">Customers</h2>
      <Separator />
      {customerList.map((user: any) => (
        <div
          key={user._id}
          className="font-bold flex flex-row justify-between mb-4"
        >
          <p>{user.name}</p>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
};

export default CustomersPage;
