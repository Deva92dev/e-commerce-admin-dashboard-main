import Gallery from "@/components/custom-ui/Gallery";
import ProductInfo from "@/components/custom-ui/ProductInfo";
import { getProductDetails } from "@/lib/actions";
import React from "react";

const ProductDetails = async ({
  params,
}: {
  params: { productId: string };
}) => {
  const productDetails = await getProductDetails(params.productId);
  return (
    <div className="grid gap-12 px-4 md:px-8 lg:px-16 xl:px-32 grid-cols-1 lg:grid-cols-2  ">
      <Gallery productMedia={productDetails.media} title={productDetails.title} />
      <ProductInfo product={productDetails} />
    </div>
  );
};

export default ProductDetails;
