/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";

import Gallery from "@/components/custom-ui/Gallery";
import GallerySkeleton from "@/components/custom-ui/GallerySkeleton";
import ProductInfoSkeleton from "@/components/custom-ui/ProductInfoSkeleton";

import {
  getPaidCustomers,
  getProductDetails,
  getRelatedProducts,
  getUserDetails,
} from "@/lib/actions";

import Reviews from "@/components/custom-ui/Reviews";
import ReviewSkeleton from "@/components/custom-ui/ReviewSkeleton";
import ProductInfo from "@/components/custom-ui/ProductInfo";
import RelatedProducts from "@/components/custom-ui/RelatedProducts";

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata(props: {
  params: Promise<{ productId: string }>;
}): Promise<Metadata> {
  const { productId } = await props.params;
  const productDetails = await getProductDetails(productId);

  if (!productDetails) {
    notFound();
  }

  return {
    title: productDetails.title,
    description: productDetails.description,
  };
}

const ProductDetailsPage = async (props: {
  params: Promise<{ productId: string }>;
}) => {
  const { productId } = await props.params;
  const [userDetails, productDetails, relatedProducts] = await Promise.all([
    getUserDetails(),
    getProductDetails(productId),
    getRelatedProducts(productId),
  ]);

  const { userId, userName, userProfileImage } = userDetails;

  let initialCanLeaveReview = false;
  let orderId = null;

  if (userId) {
    try {
      const { totalPaidCustomers, customerOrderData } = await getPaidCustomers(
        productId,
        userId
      );

      if (totalPaidCustomers > 0 && customerOrderData.length > 0) {
        const validOrder = customerOrderData.find(
          (order: any) => order.orderId
        );

        if (validOrder) {
          orderId = validOrder.orderId;
          initialCanLeaveReview = true;
        } else {
          console.error("No valid orderId found for this user.");
        }
      } else {
        console.warn("No paid customers found for this product.");
      }
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  } else {
    console.warn("Customer is not logged in");
  }

  if (!productDetails) {
    notFound();
  }

  return (
    <>
      <div className="grid gap-12 px-4 md:px-6 lg:px-12 xl:px-24 grid-cols-1 lg:grid-cols-2 mt-6 ">
        <div className="lg:col-span-1">
          {/* Static Data */}
          <Suspense fallback={<GallerySkeleton />}>
            <Gallery
              productMedia={productDetails.media}
              title={productDetails.title}
            />
          </Suspense>
        </div>
        <div className="lg:col-span-1">
          {/* Dynamic Data */}
          <Suspense fallback={<ProductInfoSkeleton />}>
            <ProductInfo product={productDetails} orderId={orderId} />
          </Suspense>
        </div>
        <div className="lg:col-span-2">
          {/* Dynamic Data */}
          <Suspense fallback={<ReviewSkeleton />}>
            <Reviews
              productId={productId}
              initialCanLeaveReview={initialCanLeaveReview}
              userId={userId}
              userProfileImage={userProfileImage}
              userName={userName}
              orderId={orderId}
            />
          </Suspense>
          <div className="mt-6">
            {/* Static Data */}
            <RelatedProducts
              relatedProducts={relatedProducts}
              productId={productId}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailsPage;
