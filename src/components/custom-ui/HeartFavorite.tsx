/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
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

  const getUserFromCache = useCallback(() => {
    const cachedUser = localStorage.getItem("cachedUser");
    if (cachedUser) {
      return JSON.parse(cachedUser);
    }
    return null;
  }, []);

  const cacheUserData = useCallback((data: any) => {
    localStorage.setItem("cachedUser", JSON.stringify(data));
  }, []);

  const getUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const cachedUser = getUserFromCache();
      if (cachedUser) {
        setIsLiked(cachedUser.wishlist.includes(product._id));
        return;
      }
      const res = await fetch("/api/users");
      const data = await res.json();
      cacheUserData(data);
      setIsLiked(data.wishlist.includes(product._id));
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [product._id, getUserFromCache, cacheUserData]);

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
        cacheUserData(updatedUser);
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
      className="border bg-productPage-accent hover:bg-yellow-400 w-max p-2 rounded-lg"
      aria-label={
        isLiked
          ? `Remove ${product.title} from your favorites`
          : `Add ${product.title} to your favorites`
      }
      title={isLiked ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart fill={isLiked ? "red" : "white"} aria-hidden="true" />
    </button>
  );
};

export default HeartFavorite;
