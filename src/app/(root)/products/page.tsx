import { Metadata } from "next";
import { notFound } from "next/navigation";

import Filters from "@/components/custom-ui/Filters";
import { Separator } from "@/components/ui/separator";
import { getProducts } from "@/lib/actions";

export const metadata: Metadata = {
  title: "Products",
};

//pagination chatgpt
const ProductPage = async () => {
  const products = await getProducts();
  if (!products) {
    notFound();
  }

  return (
    <div className=" px-4 md:px-6 lg:px-12 xl:px-24 my-8">
      <h1>Products Page</h1>
      <Separator className="mb-4" />
      <Filters products={products} />
    </div>
  );
};

export default ProductPage;
