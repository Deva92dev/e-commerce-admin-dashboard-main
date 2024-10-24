import { ProductType } from "@/lib/types";
import ProductCard from "./ProductCard";

interface RelatedProductProps {
  productId: string;
  relatedProducts: ProductType[];
}

const RelatedProducts = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  productId,
  relatedProducts,
}: RelatedProductProps) => {
  return (
    <>
      {relatedProducts.length === 0 ? (
        <p>There is no related Products</p>
      ) : (
        <div>
          <h3 className="font-bold text-2xl mb-4">Related Products</h3>
          <div className="grid max-[500px]:grid-cols-1 max-md:grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
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
