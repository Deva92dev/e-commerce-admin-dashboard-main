import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { CollectionType } from "@/lib/types";

interface CategoryProps {
  collection: CollectionType[];
}

// add more designing later
const Category = async ({ collection }: CategoryProps) => {
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
            <div className="relative h-0" style={{ paddingBottom: "66.67%" }}>
              <Image
                src={item.image}
                alt={`Image representing the ${item.title} category`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="mb-4 rounded-lg"
                loading="lazy"
                quality={75}
              />
            </div>
            <Button className="absolute top-36 right-12 bg-black hover:bg-green-800 text-white">
              {item.title}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Category;
