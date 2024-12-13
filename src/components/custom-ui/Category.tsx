import Image from "next/image";
import Link from "next/link";
import { getCollection } from "@/lib/actions";
import { notFound } from "next/navigation";

// put animation and improve coloring, infinite scroll with load more component

const Category = async () => {
  const collection = await getCollection();

  if (!collection) {
    notFound();
  }

  return (
    <section className="px-4 md:px-6 lg:px-12 xl:px-24 bg-sand-light py-12 rounded-lg">
      <h2 className="text-3xl font-bold text-olive-dark text-center mb-8 tracking-tight">
        Shop By Category
      </h2>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {collection.map((item) => (
          <div key={item._id}>
            <Link
              href={`/collections/${item._id}`}
              key={item._id}
              className="relative rounded-lg bg-cream hover:bg-sand-dark hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
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
              <div className="absolute inset-0 bg-olive-dark/40 rounded-lg hover:bg-bronze/30 transition-colors duration-300">
                <div className="flex h-full items-center justify-center">
                  <span className="text-xl font-semibold text-cream">
                    {item.title}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Category;
