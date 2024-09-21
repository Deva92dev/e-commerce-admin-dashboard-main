import Customer from "@/lib/models/Customer";
import { ConnectDB } from "@/lib/mongoDB";

import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/custom-ui/Data-Table";
import { columns } from "../../components/customers/CustomerColumn";
import { CustomersType } from "@/lib/types";

const CustomersPage = async () => {
  ConnectDB();

  const customers: CustomersType[] = await Customer.find({}).sort({
    createdAt: "desc",
  });

  return (
    <div className="px-10 py-5">
      <h2 className="font-bold text-3xl">Customers</h2>
      <Separator />
      <DataTable columns={columns} data={customers} searchKey="name" />
    </div>
  );
};

export default CustomersPage;
