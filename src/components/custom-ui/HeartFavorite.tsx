"use client";

import { ProductType, UserType } from "@/lib/types";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Heart } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";

interface HeartFavoriteProps {
  product: ProductType;
  updateSignedInUser?: (updatedUser: UserType) => void;
}

const HeartFavorite = ({ product, updateSignedInUser }: HeartFavoriteProps) => {
  const { user } = useUser();

  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/users");
      const data = await res.json();
      setIsLiked(data.wishlist.includes(product._id));
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [product._id]);

  useEffect(() => {
    if (user) {
      getUser();
    }
  }, [getUser, user]);

  const handleLike = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      if (!user) {
        return (
          <div>
            <SignInButton mode="modal">
              <Button className="w-full text-center outline bg-black text-white hover:bg-blue-400 text-base font-bold rounded-lg px-2 py-3">
                Login
              </Button>
            </SignInButton>
          </div>
        );
      } else {
        const res = await fetch("/api/users/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId: product._id }),
        });
        const updatedUser = await res.json();
        setIsLiked(updatedUser.wishlist.includes(product._id));
        updateSignedInUser && updateSignedInUser(updatedUser);
      }
    } catch (error) {
      console.log(["wishlist_POST"], error);
    }
  };

  return (
    <button
      onClick={handleLike}
      className="border bg-gray-100 w-max p-2 rounded-lg"
    >
      <Heart fill={isLiked ? "red" : "white"} />
    </button>
  );
};

export default HeartFavorite;
