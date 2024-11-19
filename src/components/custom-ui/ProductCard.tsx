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
      className="bg-border rounded-lg"
    >
      <div className="relative h-72">
        <Image
          src={product.media[0]}
          alt={product.title}
          fill
          priority
          sizes="(max-width:768px) 100vw (max-width:1200px) 50vw"
          className="object-cover overflow-hidden rounded-t-lg"
        />
      </div>
      {/* text section */}
      <div className="px-2 my-4">
        <div className="flex flex-col justify-between my-4">
          <h2 className="text-base font-bold">{product.title} </h2>
          <p className="text-sm">{product.category}</p>
        </div>
        <div className="flex flex-row justify-between">
          <p>{formatPrice(product.price)}</p>
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
