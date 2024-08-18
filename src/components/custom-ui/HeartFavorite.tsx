"use client";

import { ProductType, UserType } from "@/lib/types";
import { useUser } from "@clerk/nextjs";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface HeartFavoriteProps {
  product: ProductType;
  updateSignedInUser?: (updatedUser: UserType) => void;
}

const HeartFavorite = ({ product, updateSignedInUser }: HeartFavoriteProps) => {
  const router = useRouter();
  const { user } = useUser();

  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getUser = async () => {
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
  };

  useEffect(() => {
    if (user) {
      getUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleLike = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      if (!user) {
        router.push("/sign-in");
        return;
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
    <button onClick={handleLike}>
      <Heart fill={isLiked ? "red" : "white"} />
    </button>
  );
};

export default HeartFavorite;
