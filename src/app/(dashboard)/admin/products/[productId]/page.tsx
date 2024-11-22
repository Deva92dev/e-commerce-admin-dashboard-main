"use client";

import ProductForm from "@/app/(dashboard)/components/products/ProductForm";
import Loader from "@/components/custom-ui/Loader";
import { ProductType } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

const ProductDetailsPage = ({ params }: { params: { productId: string } }) => {
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState<ProductType | null>(
    null
  );

  const getProductDetails = useCallback(async () => {
    try {
      const res = await fetch(`/api/products/${params.productId}`, {
        method: "GET",
      });
      const data = await res.json();
      setProductDetails(data);
      setLoading(false);
    } catch (error) {
      console.log(`ProductId_API`, error);
    }
  }, [params.productId]);

  useEffect(() => {
    getProductDetails();
  }, [getProductDetails]);

  return loading ? <Loader /> : <ProductForm initialData={productDetails} />;
};

export default ProductDetailsPage;
