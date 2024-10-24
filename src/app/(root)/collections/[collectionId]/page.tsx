import ProductCard from "@/components/custom-ui/ProductCard";
import { getCollectionDetails } from "@/lib/actions/collectionDetails.actions";
import { CollectionType, ProductType } from "@/lib/types";
import { Metadata } from "next";
import Image from "next/image";

export async function generateMetadata(
  props: {
    params: Promise<{ collectionId: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const collectionDetails: CollectionType = await getCollectionDetails(
    params.collectionId
  );

  return {
    title: collectionDetails.title,
    description: collectionDetails.description,
    openGraph: {
      images: [
        {
          url: collectionDetails.image,
        },
      ],
    },
  };
}

const CollectionDetailsPage = async (
  props: {
    params: Promise<{ collectionId: string }>;
  }
) => {
  const params = await props.params;
  const collectionDetails: CollectionType = await getCollectionDetails(
    params.collectionId
  );

  return (
    <div className=" px-4 md:px-6 lg:px-12 xl:px-24 my-8">
      <h2 className="text-3xl font-bold text-center mb-4">Shop By Category</h2>
      <div className="rounded-lg flex flex-col items-center gap-8 shadow-md">
        <Image
          src={collectionDetails.image}
          alt={collectionDetails.title}
          width={1500}
          height={1000}
          className="w-full h-[400px] object-cover rounded-t-xl"
        />
        <p className="font-bold text-xl px-2 mb-2">{collectionDetails.title}</p>
        <p className="text-lg px-2 mb-2">{collectionDetails.description}</p>
      </div>
      <div className="mt-10 grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {collectionDetails.products.map((product: ProductType, index) => (
          <ProductCard product={product} key={product._id || index} />
        ))}
      </div>
    </div>
  );
};

export default CollectionDetailsPage;
