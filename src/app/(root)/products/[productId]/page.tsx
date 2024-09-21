import Gallery from "@/components/custom-ui/Gallery";
import ProductInfo from "@/components/custom-ui/ProductInfo";
import RelatedProducts from "@/components/custom-ui/RelatedProducts";
import Reviews from "@/components/custom-ui/Reviews";
import { getProductDetails } from "@/lib/actions";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { productId: string };
}): Promise<Metadata> {
  const productDetails = await getProductDetails(params.productId);
  return {
    title: productDetails.title,
    description: productDetails.description,
    openGraph: {
      images: [
        {
          url: productDetails.media[0],
        },
      ],
    },
  };
}

const ProductDetails = async ({
  params,
}: {
  params: { productId: string };
}) => {
  const user = await currentUser();
  const userId = user?.id;
  const userProfileImage = user?.imageUrl;
  const userName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : undefined;

  const productDetails = await getProductDetails(params.productId);

  let initialCanLeaveReview = false;
  let orderId = null;

  if (userId) {
    try {
      const res = await fetch(
        `http://localhost:3000/api/customers/${userId}/${params.productId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const { totalPaidCustomers, customerOrderData } = await res.json();

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
        console.error("No paid customers found.");
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
          <ProductInfo product={productDetails} />
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
            <RelatedProducts productId={params.productId} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
