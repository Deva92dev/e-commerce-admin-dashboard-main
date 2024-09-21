import ProductCard from "@/components/custom-ui/ProductCard";
import ProductCardSkeleton from "@/components/custom-ui/ProductCardSkeleton";
import { ProductType } from "@/lib/types";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Search - Own Closet",
};

const Search = async ({ params }: { params: { query: string } }) => {
  const res = await fetch(`http://localhost:3000/api/search/${params.query}`);
  const searchedProducts = await res.json();

  const decodedQuery = decodeURIComponent(params.query);

  return (
    <div className="px-10 py-5">
      <p className="font-bold py-10">Search Results for {decodedQuery}</p>
      {!searchedProducts ||
        (searchedProducts.length === 0 && (
          <p className="font-bold my-5">
            No Product found for your search result
          </p>
        ))}
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {searchedProducts?.map((product: ProductType) => (
          <Suspense key={product._id} fallback={<ProductCardSkeleton />}>
            <ProductCard product={product} />
          </Suspense>
        ))}
      </div>
    </div>
  );
};

export default Search;
