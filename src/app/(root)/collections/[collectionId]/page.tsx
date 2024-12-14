import Image from "next/image";
import { Metadata } from "next";
import ProductCard from "@/components/custom-ui/ProductCard";
import { CollectionType, ProductType } from "@/lib/types";
import { notFound } from "next/navigation";
import { getCollectionDetails } from "@/lib/actions";
import Link from "next/link";

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
    <section className="px-4 md:px-6 lg:px-12 xl:px-24 py-8 bg-collectionsDetails-primary">
      <h1 className="text-4xl font-bold text-center text-collectionsDetails-secondary mb-10">
        {collectionDetails.title} Category
      </h1>
      <div className="rounded-lg flex flex-col items-center gap-6 shadow-lg bg-collectionsDetails-secondary/20">
        <div className="relative w-full aspect-[16/9] overflow-hidden rounded-t-lg">
          <Image
            src={collectionDetails.image}
            alt={`Image of ${collectionDetails.title} collection`}
            fill
            className="object-cover"
            priority
          />
        </div>
        <h3 className="font-extrabold text-gray-700 text-2xl">
          {collectionDetails.title}
        </h3>
        <p className="text-lg text-gray-900 text-center max-w-2xl">
          {collectionDetails.description}
        </p>
      </div>
      <div className="mt-10 grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {collectionDetails.products.map((product: ProductType, index) => (
          <ProductCard product={product} key={product._id || index} />
        ))}
      </div>
      <div className="text-center mt-12">
        <Link
          href="/collections"
          className="bg-collectionsDetails-accent text-white font-semibold px-6 py-3 rounded-lg hover:bg-collectionsDetails-accent/90"
        >
          Explore More Collections
        </Link>
      </div>
    </section>
  );
};

export const dynamic = "force-dynamic";

export default CollectionDetailsPage;
