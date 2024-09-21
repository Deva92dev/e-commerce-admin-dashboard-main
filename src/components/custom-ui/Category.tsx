import { getCollection } from "@/lib/actions";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

// add more designing later
const Category = async () => {
  const collection = await getCollection();

  return (
    <div className=" px-4 md:px-6 lg:px-12 xl:px-24 my-8">
      <h2 className="text-3xl font-bold text-center mb-4">Shop By Category</h2>
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {collection.map((item) => (
          <Link
            href={`/collections/${item._id}`}
            key={item._id}
            className="relative bg-white rounded-sm hover:shadow-lg"
          >
            <div className="relative h-72">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width:768px) 100vw (max-width:1200px) 50vw"
                className="mb-4 rounded-t-lg"
              />
            </div>
            <Button className="absolute top-36 right-12 bg-blue-500 text-white">
              {item.title}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Category;
