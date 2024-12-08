import { Metadata } from "next";
import { notFound } from "next/navigation";

import Filters from "@/components/custom-ui/Filters";
import { Separator } from "@/components/ui/separator";
import { getProducts } from "@/lib/actions";
import { Suspense } from "react";
import Loader from "@/components/custom-ui/Loader";

export const metadata: Metadata = {
  title: "Products",
};

const ProductPage = async () => {
  const products = await getProducts();
  if (!products) {
    notFound();
  }

  return (
    <main className="px-4 md:px-6 lg:px-12 xl:px-24 pb-8 bg-productPage-primary">
      <h1 className="text-4xl font-bold text-gray-800 text-center py-4 tracking-tight">
        Products Page
      </h1>
      <Separator className="mb-4 h-1" />
      <Suspense fallback={<Loader />}>
        <Filters products={products} />
      </Suspense>
    </main>
  );
};

export default ProductPage;
