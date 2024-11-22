import Image from "next/image";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { formatPrice } from "@/lib/formatPrice";
import { ProductType } from "@/lib/types";

interface LatestProductsProps {
  latestProducts: ProductType[];
}

const LatestProducts = async ({ latestProducts }: LatestProductsProps) => {
  return (
    <div className=" px-4 md:px-6 lg:px-12 xl:px-24 my-8">
      <h2 className="text-3xl font-bold text-center mb-4">Latest Products</h2>
      <Separator />
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-4">
        {latestProducts?.slice(0, 3).map((item: ProductType) => (
          <Link
            href="/products"
            key={item._id}
            className="rounded-sm hover:shadow-lg"
          >
            <div className="relative h-0" style={{ paddingBottom: "66.67%" }}>
              <Image
                src={item.media[0]}
                alt={`Image representing the ${item.title} product`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover overflow-hidden rounded-t-lg"
                loading="lazy"
                quality={75}
              />
            </div>
            <div className="my-4 px-2">
              <h3 className="text-base font-bold">{item.title}</h3>
              <p className="text-sm">{formatPrice(item.price)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LatestProducts;
