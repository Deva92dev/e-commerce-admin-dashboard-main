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
    <div className=" px-4 md:px-6 lg:px-12 xl:px-24 my-8">
      <h1>Products Page</h1>
      <Separator className="mb-4" />
      <Suspense fallback={<Loader />}>
        <Filters products={products} />
      </Suspense>
    </div>
  );
};

export default ProductPage;
