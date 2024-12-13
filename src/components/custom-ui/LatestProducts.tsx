import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/formatPrice";
import { ProductType } from "@/lib/types";
import { getProducts } from "@/lib/actions";
import { notFound } from "next/navigation";

const LatestProducts = async () => {
  const latestProducts: ProductType[] = await getProducts();

  if (!latestProducts) {
    notFound();
  }

  return (
    <section className="px-4 py-8 md:px-6 lg:px-12 xl:px-24 bg-sand-light rounded-lg">
      <h2 className="text-3xl font-bold text-olive-dark text-center mb-8 tracking-tight">
        Latest Products
      </h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
        {latestProducts?.slice(0, 4).map((item: ProductType) => (
          <Link
            href={`/products/${item._id}`}
            key={item._id}
            className="rounded-lg bg-white hover:bg-sand-light hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={item.media[0]}
                alt={`Image representing the ${item.title} product`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover rounded-t-lg"
                loading="lazy"
                quality={75}
              />
            </div>
            <div className="my-4 px-4 py-2 flex justify-between items-center bg-olive-dark rounded-b-lg">
              <h3 className="text-base font-semibold font-serif text-sand-light">
                {item.title}
              </h3>
              <p className="text-sm font-medium text-sand-light">
                {formatPrice(item.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default LatestProducts;
