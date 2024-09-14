"use client";
import { formatPrice } from "@/lib/formatPrice";
import { ProductType } from "@/lib/types";
import React, { useState } from "react";
import HeartFavorite from "./HeartFavorite";
import { MinusCircle, PlusCircle } from "lucide-react";
import useCart from "@/lib/hooks/useCart";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "../ui/button";

interface ProductInfoProps {
  product: ProductType;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const cart = useCart();
  const { user } = useUser();
  const { category, color, description, price, sizes, title } = product;

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedColor, setSelectedColor] = useState<string>(color[0]);
  const [selectedSize, setSelectedSize] = useState<string>(sizes[0]);

  return (
    <div className="max-w-[400px] flex flex-col gap-8">
      <div className="flex justify-between">
        <h2 className="font-bold text-3xl">{title}</h2>
        <HeartFavorite product={product} />
      </div>
      <p className="text-sm font-normal text-gray-500">Category : {category}</p>
      <p className="font-bold mt-2">{formatPrice(price)}</p>
      <div className="flex flex-col text-gray-500">
        Description : {description}
      </div>

      {/* color */}
      {product.color.length > 0 && (
        <div className="flex flex-col text-gray-500">
          Color:
          <div className="flex flex-row gap-4">
            {color.map((item, index) => (
              <button
                key={index}
                className={`p-2 my-2 border border-black rounded-xl text-black hover:bg-blue-400 ${
                  selectedColor === item && "bg-black text-white"
                }`}
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
                className={`p-2 my-2 border border-black rounded-xl text-black hover:bg-blue-400 ${
                  selectedSize === item && "bg-black text-white"
                }`}
                onClick={() => setSelectedSize(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* quantity */}
      <div className="flex flex-col gap-4">
        <p className="text-gray-500">Quantity: </p>
        <div className="flex items-center gap-4">
          <MinusCircle
            className="cursor-pointer"
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
          />
          <p className="font-medium">{quantity}</p>
          {/* number of stock will define plus quantity */}
          <PlusCircle
            className="cursor-pointer"
            onClick={() => setQuantity(quantity + 1)}
          />
        </div>
      </div>

      {user ? (
        <button
          className="outline bg-black text-white hover:bg-blue-400 text-base font-bold rounded-lg px-2 py-3"
          onClick={() => {
            cart.addItem({
              item: product,
              quantity,
              color: selectedColor,
              sizes: selectedSize,
            });
          }}
        >
          Add to Cart
        </button>
      ) : (
        <SignInButton mode="modal">
          <Button className="w-full text-center outline bg-black text-white hover:bg-blue-400 text-base font-bold rounded-lg px-2 py-3">
            Login
          </Button>
        </SignInButton>
      )}
    </div>
  );
};

export default ProductInfo;
