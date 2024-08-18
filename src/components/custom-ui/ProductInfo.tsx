"use client";
import { formatPrice } from "@/lib/formatPrice";
import { ProductType } from "@/lib/types";
import React, { useState } from "react";
import HeartFavorite from "./HeartFavorite";
import { MinusCircle, PlusCircle } from "lucide-react";

interface ProductInfoProps {
  product: ProductType;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const {
    _id,
    category,
    collections,
    color,
    description,
    price,
    sizes,
    tags,
    title,
  } = product;

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedColor, setSelectedColor] = useState<string>(" ");
  const [selectedSize, setSelectedSize] = useState<string>(" ");

  return (
    <div className="max-w-[400px] flex flex-col gap-4">
      <div className="flex justify-between">
        <h2 className="font-bold text-3xl">{title}</h2>
        <HeartFavorite product={product} />
      </div>
      <p className="text-sm font-normal text-gray-500">Category : {category}</p>
      <p className="font-bold mt-2">{formatPrice(price)}</p>
      <div className="flex flex-col text-gray-500">Description : </div>
      <p>{description}</p>

      {/* color */}
      {product.color.length > 0 && (
        <div className="flex flex-col text-gray-500">
          Color:
          <div className="flex flex-row gap-4">
            {color.map((item, index) => (
              <button
                key={index}
                className={`p-2 my-2 border border-black rounded-xl text-black hover:bg-blue-400 ${selectedColor ? " " : " "}`}
                onClick={() => setSelectedColor(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* sizes */}
      {product.sizes.length > 0 && (
        <div className="flex flex-col text-gray-500">
          Sizes:
          <div className="flex flex-row gap-4">
            {sizes.map((item, index) => (
              <button
                key={index}
                className=" p-2 my-2 border border-black rounded-xl text-black hover:bg-blue-400"
                onClick={()=> setSelectedSize(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* quantity */}
      <div className="flex flex-col gap-4">
        <p>Quantity</p>
        <div className="flex gap-4">
          <MinusCircle />
          {quantity}
          <PlusCircle />
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
