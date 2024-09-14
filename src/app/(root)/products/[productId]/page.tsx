import Gallery from "@/components/custom-ui/Gallery";
import ProductInfo from "@/components/custom-ui/ProductInfo";
import Reviews from "@/components/custom-ui/Reviews";
import { getPaidCustomers, getProductDetails } from "@/lib/actions";
import { auth } from "@clerk/nextjs/server";

const ProductDetails = async ({
  params,
}: {
  params: { productId: string };
}) => {
  const userId = auth().userId || undefined;
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
        console.log("Total paid Customers: ", totalPaidCustomers);

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
    <div className="grid gap-12 px-4 md:px-8 lg:px-16 xl:px-32 grid-cols-1 lg:grid-cols-2  ">
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
          orderId={orderId}
        />
      </div>
    </div>
  );
};

export default ProductDetails;
