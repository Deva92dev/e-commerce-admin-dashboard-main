"use client";
import { formatPrice } from "@/lib/formatPrice";
import { ProductType } from "@/lib/types";
import React, { useState } from "react";
import HeartFavorite from "./HeartFavorite";
import { MinusCircle, PlusCircle, Star } from "lucide-react";
import useCart from "@/lib/hooks/useCart";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "../ui/button";

interface ProductInfoProps {
  product: ProductType;
  orderId: string | null;
}

const ProductInfo = ({ product, orderId }: ProductInfoProps) => {
  const cart = useCart();
  const { user } = useUser();
  const {
    category,
    color,
    description,
    price,
    sizes,
    title,
    review,
    averageRating,
    numberOfReviews,
  } = product;

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedColor, setSelectedColor] = useState<string>(color[0]);
  const [selectedSize, setSelectedSize] = useState<string>(sizes[0]);
  const [stockQuantity, setStockQuantity] = useState<number>(
    product.stockQuantity
  );

  const updateOrderStatus = async () => {
    if (orderId && stockQuantity > 0) {
      try {
        const res = await fetch(`/api/orders/${orderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "paid" }),
        });
        if (res.ok) {
          const updatedStock = stockQuantity - quantity;
          setStockQuantity(updatedStock > 0 ? updatedStock : 0);
        }
      } catch (error) {
        console.error("Error updating order status/stock quantity", error);
      }
    }
  };

  return (
    <div className="max-w-[400px] flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="font-bold text-4xl">{title}</h1>
        {user && <HeartFavorite product={product} />}
      </div>
      {review.length > 0 && (
        <p className="flex flex-row gap-1 items-center font-semibold">
          <Star className="h-4 w-4" />
          {averageRating.toFixed(1)} <span>({numberOfReviews})</span> reviews
        </p>
      )}
      <p className="text-sm font-normal text-gray-500">Category : {category}</p>
      <p className="font-bold border text-lg bg-gray-100 w-max p-2 rounded-lg">
        {formatPrice(price)}
      </p>
      <p className="text-privacyPolicy-secondary font-black">
        {stockQuantity > 0 ? "In Stock" : "Out of Stock"}
      </p>
      <div className="flex flex-col text-gray-500">
        <span className="text-privacyPolicy-secondary font-semibold">
          Description :
        </span>
        {description}
      </div>

      {/* color */}
      {product.color.length > 0 && (
        <div className="flex flex-col font-bold text-productDetails-secondary">
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
        <div className="flex flex-col font-bold text-productDetails-secondary">
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
          className="bg-productDetails-accent text-gray-700  hover:bg-productDetails-accent/60 text-base font-bold rounded-lg px-2 py-3"
          onClick={() => {
            cart.addItem({
              item: product,
              quantity,
              color: selectedColor,
              sizes: selectedSize,
            });
            updateOrderStatus();
          }}
          disabled={stockQuantity <= 0}
        >
          {stockQuantity > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
      ) : (
        <SignInButton mode="modal">
          <Button className="w-full text-center outline bg-navbar-hover hover:bg-navbar-hover/60 text-gray-700 text-base font-bold rounded-lg px-2 py-3">
            Login
          </Button>
        </SignInButton>
      )}
    </div>
  );
};

export default ProductInfo;
