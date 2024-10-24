"use client";

import { ProductType, UserType } from "@/lib/types";
import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import ProductCard from "@/components/custom-ui/ProductCard";
import Loader from "@/components/custom-ui/Loader";
import { getProductDetails } from "@/lib/actions/productDetails.actions";

const WishlistPage = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [signedInUser, setSignedInUser] = useState<UserType | null>(null);
  const [wishlist, setWishlist] = useState<ProductType[]>([]);

  const getUser = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      setSignedInUser(data);
      setLoading(false);
    } catch (error) {
      console.log("[wishlistUser_Get]", error);
    }
  };

  useEffect(() => {
    if (user) {
      getUser();
    }
  }, [user]);

  const getWishlistProducts = useCallback(async () => {
    setLoading(true);
    if (!signedInUser) return;

    // cause we have productIds in wishlist, to extract more information
    const wishlistProducts = await Promise.all(
      signedInUser.wishlist.map(async (productId) => {
        const res = await getProductDetails(productId);
        return res;
      })
    );

    setWishlist(wishlistProducts);
    setLoading(false);
  }, [signedInUser]);

  useEffect(() => {
    if (signedInUser) {
      getWishlistProducts();
    }
  }, [getWishlistProducts, signedInUser]);

  const updateSignedInUser = (updatedUser: UserType) => {
    setSignedInUser(updatedUser);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="px-4 md:px-6 lg:px-12 xl:px-24 ">
      <h2 className="font-bold text-2xl my-5">Your Wishlist</h2>
      {wishlist.length === 0 && <p>No Items in your wishlist</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
        {wishlist.map((product) => (
          <ProductCard
            product={product}
            key={product._id}
            updateSignedInUser={updateSignedInUser}
          />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
