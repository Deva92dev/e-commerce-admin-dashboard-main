import Image from "next/image";
import { Metadata } from "next";
import ProductCard from "@/components/custom-ui/ProductCard";
import { CollectionType, ProductType } from "@/lib/types";
import { notFound } from "next/navigation";
import { getCollectionDetails } from "@/lib/actions";

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: { collectionId: string };
}): Promise<Metadata> {
  const collectionDetails: CollectionType | null = await getCollectionDetails(
    params.collectionId
  );

  if (!collectionDetails) {
    notFound();
  }

  return {
    title: collectionDetails.title,
    description: collectionDetails.description,
  };
}

const CollectionDetailsPage = async ({
  params,
}: {
  params: { collectionId: string };
}) => {
  const collectionDetails: CollectionType | null = await getCollectionDetails(
    params.collectionId
  );

  if (!collectionDetails) {
    notFound();
  }

  return (
    <div className=" px-4 md:px-6 lg:px-12 xl:px-24 my-8">
      <h2 className="text-3xl font-bold text-center mb-4">Shop By Category</h2>
      <div className="rounded-lg flex flex-col items-center gap-8 shadow-md">
        <Image
          src={collectionDetails.image}
          alt={`Image of ${collectionDetails.title} collection`}
          width={600} // for mobile devices
          height={400} // for mobile devices
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,[BASE64_STRING]"
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
