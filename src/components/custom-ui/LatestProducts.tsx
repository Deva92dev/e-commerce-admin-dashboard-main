import { getProducts } from "@/lib/actions";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Separator } from "../ui/separator";
import { formatPrice } from "@/lib/formatPrice";

// so that i don't have to fetch data twice
const LatestProducts = async () => {
  const latestProducts = await getProducts();

  return (
    <div className=" px-4 md:px-6 lg:px-12 xl:px-24 my-8">
      <h2 className="text-3xl font-bold text-center mb-4">Latest Products</h2>
      <Separator />
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-4">
        {latestProducts?.slice(0, 3).map((item) => (
          // change href to dynamic id
          <Link
            href="/products"
            key={item._id}
            className="rounded-sm hover:shadow-lg"
          >
            <div className="relative h-72">
              <Image
                src={item.media[0]}
                alt={item.title}
                fill
                sizes="(max-width:768px) 100vw (max-width:1200px) 50vw"
                className="object-cover overflow-hidden rounded-t-lg"
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
