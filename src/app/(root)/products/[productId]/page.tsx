/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Gallery from "@/components/custom-ui/Gallery";
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

export async function generateMetadata({
  params,
}: {
  params: { productId: string };
}): Promise<Metadata> {
  const productDetails = await getProductDetails(params.productId);

  if (!productDetails) {
    notFound();
  }

  return {
    title: productDetails.title,
    description: productDetails.description,
  };
}

const ProductDetailsPage = async ({
  params,
}: {
  params: { productId: string };
}) => {
  const [userDetails, productDetails, relatedProducts] = await Promise.all([
    getUserDetails(),
    getProductDetails(params.productId),
    getRelatedProducts(params.productId),
  ]);

  const { userId, userName, userProfileImage } = userDetails;
  let initialCanLeaveReview = false;
  let orderId = null;

  if (userId) {
    try {
      const { totalPaidCustomers, customerOrderData } = await getPaidCustomers(
        params.productId,
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
          if (process.env.NODE_ENV === "development") {
            console.error("No valid orderId found for this user.");
          }
        }
      } else {
        if (process.env.NODE_ENV === "development") {
          console.error("No paid customers found for this product.");
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error fetching customer details:", error);
      }
    }
  } else {
    if (process.env.NODE_ENV === "development") {
      console.error("Customer is not logged in");
    }
  }

  if (!productDetails) {
    notFound();
  }

  return (
    <main>
      <section className="grid gap-20 px-4 md:px-6 lg:px-12 xl:px-24 grid-cols-1 lg:grid-cols-2 py-6">
        <article className="lg:col-span-1">
          <Gallery
            productMedia={productDetails.media}
            title={productDetails.title}
          />
        </article>
        <article className="lg:col-span-1">
          <Suspense fallback={<ProductInfoSkeleton />}>
            <ProductInfo product={productDetails} orderId={orderId} />
          </Suspense>
        </article>
        <article className="lg:col-span-2">
          <Suspense fallback={<ReviewSkeleton />}>
            <Reviews
              productId={params.productId}
              initialCanLeaveReview={initialCanLeaveReview}
              userId={userId}
              userProfileImage={userProfileImage}
              userName={userName}
              orderId={orderId}
            />
          </Suspense>
          <article className="mt-6">
            <RelatedProducts
              relatedProducts={relatedProducts}
              productId={params.productId}
            />
          </article>
        </article>
      </section>
    </main>
  );
};

export default ProductDetailsPage;

export const dynamic = "force-dynamic";
