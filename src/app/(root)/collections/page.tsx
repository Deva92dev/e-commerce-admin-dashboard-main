import { Separator } from "@/components/ui/separator";
import { getCollection } from "@/lib/actions";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const CollectionPage = async () => {
  const collections = await getCollection();
  if (!collections) {
    notFound();
  }

  return (
    <main className="px-4 md:px-6 lg:px-12 xl:px-24 py-8 bg-collectionPage-primary">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-4 tracking-tight">
        All Collections
      </h1>
      <Separator className="mb-4 h-1" />
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {collections.map((item) => (
          <Link
            href={`/collections/${item._id}`}
            key={item._id}
            className="relative rounded-lg hover:shadow-2xl bg-landingPage-category hover:transition-transform hover:scale-105 overflow-hidden"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src={item.image}
                alt={`Image representing the ${item.title} category`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="mb-4 object-cover"
                loading="lazy"
                quality={75}
              />
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-lg">
              <div className="flex h-full items-center justify-center">
                <span className="text-xl font-semibold text-white">
                  {item.title}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default CollectionPage;
