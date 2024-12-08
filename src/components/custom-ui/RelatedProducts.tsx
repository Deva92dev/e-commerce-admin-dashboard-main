/* eslint-disable @typescript-eslint/no-unused-vars */
import { ProductType } from "@/lib/types";
import ProductCard from "./ProductCard";

interface RelatedProductProps {
  productId: string;
  relatedProducts: ProductType[];
}

const RelatedProducts = async ({
  productId,
  relatedProducts,
}: RelatedProductProps) => {
  return (
    <>
      {relatedProducts.length === 0 ? (
        <h2>There is no related Products</h2>
      ) : (
        <div>
          <h2 className="font-bold text-2xl mb-4">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {relatedProducts.map((product: ProductType) => (
              <ProductCard product={product} key={product._id} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default RelatedProducts;
