"use client";

import Loader from "@/components/custom-ui/Loader";
import ProductCard from "@/components/custom-ui/ProductCard";
import { getProductDetails } from "@/lib/actions";
import { ProductType, UserType } from "@/lib/types";
import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";

const Wishlist = () => {
  const { user } = useUser();

  const [loading, setLoading] = useState(true);
  const [signedInUser, setSignedInUser] = useState<UserType | null>(null);
  const [wishlist, setWishlist] = useState<ProductType[]>([]);

  const getUser = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setSignedInUser(data);
      setLoading(false);
    } catch (err) {
      console.log("[users_GET", err);
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
    const wishlistProducts = await Promise.all(
      signedInUser.wishlist.map(async (productId) => {
        const res = await getProductDetails(productId);
        return res;
      })
    );

    // Filter out any null values
    const validProducts = wishlistProducts.filter(
      (product): product is ProductType => product !== null
    );
    setWishlist(validProducts);
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

  return loading ? (
    <Loader />
  ) : (
    <div className="px-4 md:px-6 lg:px-12 xl:px-24 pt-20 pb-8 bg-wishlistPage-primary/10">
      <h1 className="font-bold text-3xl my-10">Your Wishlist</h1>
      {wishlist.length === 0 && (
        <p className="font-semibold text-xl">No items in your wishlist</p>
      )}

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {wishlist.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            updateSignedInUser={updateSignedInUser}
          />
        ))}
      </div>
    </div>
  );
};

export const dynamic = "force-dynamic";

export default Wishlist;
