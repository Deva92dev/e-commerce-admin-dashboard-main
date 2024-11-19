import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CollectionTable from "../../components/collections/CollectionTable";

export default async function CollectionsPage() {
  return (
    <main className="p-12">
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-semibold text-gray-700">Collections </h1>
        <Link href="/admin/collections/new">
          <Button className="bg-blue-600">
            <Plus className="h-4 w-4 mr-2" /> Create Collection
          </Button>
        </Link>
      </div>
      <Separator className="bg-gray-600 mt-2 mb-8" />
      <CollectionTable />
    </main>
  );
}
