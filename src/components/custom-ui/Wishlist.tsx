"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import ProductCard from "@/components/custom-ui/ProductCard";
import Loader from "@/components/custom-ui/Loader";
import { ProductType } from "@/lib/types";

const Wishlist = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState<ProductType[]>([]);

  const getWishlistProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/users/wishlist");
      const data = await response.json();
      setWishlist(data);
    } catch (error) {
      console.log("[wishlist_Get]", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getWishlistProducts();
    }
  }, [user]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="px-4 md:px-6 lg:px-12 xl:px-24">
      <h2 className="font-bold text-2xl my-5">Your Wishlist</h2>
      {wishlist.length === 0 && <p>No Items in your wishlist</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {wishlist.map((product) => (
          <ProductCard product={product} key={product._id} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
