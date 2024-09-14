import Filters from "@/components/custom-ui/Filters";
import ProductCard from "@/components/custom-ui/ProductCard";
import ProductCardSkeleton from "@/components/custom-ui/ProductCardSkeleton";
import { Separator } from "@/components/ui/separator";
import { getProducts } from "@/lib/actions";
import { Suspense } from "react";

// do filtering must
const ProductPage = async () => {
  const products = await getProducts();

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 my-8">
      <h1>Products Page</h1>
      <Separator className="mb-4" />
      <Filters products={products} />
    </div>
  );
};

export default ProductPage;
