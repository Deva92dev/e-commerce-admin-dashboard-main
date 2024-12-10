import { ProductType, UserType } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "../../lib/formatPrice";
import HeartFavorite from "./HeartFavorite";

interface ProductCardProps {
  product: ProductType;
  updateSignedInUser?: (updateUser: UserType) => void;
}

const ProductCard = ({ product, updateSignedInUser }: ProductCardProps) => {
  return (
    <Link
      href={`/products/${product._id}`}
      key={product._id}
      className="bg-border aspect-[4/3] rounded-lg hover:shadow-2xl bg-landingPage-latest-link hover:transition-transform hover:scale-105"
    >
      <div className="relative h-72">
        <Image
          src={product.media[0]}
          alt={product.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover overflow-hidden rounded-t-lg group-hover:opacity-90"
        />
      </div>
      {/* text section */}
      <div className="px-2 my-4">
        <div className="flex flex-row justify-between my-4 bg-gray-200 rounded-lg p-2">
          <h2 className="text-base font-semibold font-serif text-gray-800">
            {product.title}
          </h2>
          <p className="text-sm font-medium text-black">{product.category}</p>
        </div>
        <div className="flex flex-row justify-between">
          <div className="rounded-lg font-bold p-3 text-productPage-secondary w-max">
            <p>{formatPrice(product.price)}</p>
          </div>
          <HeartFavorite
            product={product}
            updateSignedInUser={updateSignedInUser}
          />
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
