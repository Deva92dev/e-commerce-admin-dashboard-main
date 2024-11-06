/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from "next";

import Gallery from "@/components/custom-ui/Gallery";
import ProductInfo from "@/components/custom-ui/ProductInfo";
import RelatedProducts from "@/components/custom-ui/RelatedProducts";
import Reviews from "@/components/custom-ui/Reviews";
import { getPaidCustomers } from "@/lib/actions/paidCustomers.actions";
import { getProductDetails } from "@/lib/actions/productDetails.actions";
import { getRelatedProducts } from "@/lib/actions/relatedProducts.actions";
import { getUserDetails } from "@/lib/actions/getAuthUser";

export async function generateMetadata(props: {
  params: Promise<{ productId: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const productDetails = await getProductDetails(params.productId);
  return {
    title: productDetails.title,
    description: productDetails.description,
  };
}

// in stock for each product, gallery and productInfo is not changing frequently, make them not making request each time
const ProductDetailsPage = async (props: {
  params: Promise<{ productId: string }>;
}) => {
  const params = await props.params;

  const { userId, userName, userProfileImage } = await getUserDetails();

  const [productDetails, relatedProducts] = await Promise.all([
    getProductDetails(params.productId),
    getRelatedProducts(params.productId),
  ]);

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
          console.error("No valid orderId found for this user.");
        }
      } else {
        console.warn("No paid customers found for this product.");
      }
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  } else {
    console.error("Customer is not logged in");
  }

  return (
    <>
      <div className="grid gap-12 px-4 md:px-6 lg:px-12 xl:px-24 grid-cols-1 lg:grid-cols-2 mt-6 ">
        <div className="lg:col-span-1">
          <Gallery
            productMedia={productDetails.media}
            title={productDetails.title}
          />
        </div>
        <div className="lg:col-span-1">
          <ProductInfo product={productDetails} orderId={orderId} />
        </div>
        <div className="lg:col-span-2">
          <Reviews
            productId={params.productId}
            initialCanLeaveReview={initialCanLeaveReview}
            userId={userId}
            userProfileImage={userProfileImage}
            userName={userName}
            orderId={orderId}
          />
          <div className="mt-6">
            <RelatedProducts
              relatedProducts={relatedProducts}
              productId={params.productId}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailsPage;
