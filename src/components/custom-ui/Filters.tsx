"use client";

import React, { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProductType, UserType } from "@/lib/types";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

interface FilterProps {
  products: ProductType[];
}

const Filters = ({ products }: FilterProps) => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState(products);

  // filtering of products
  const filterProducts = (params: URLSearchParams) => {
    let filtered = [...products];
    // Apply Collection filter
    const collection = params.get("collection");
    if (collection) {
      filtered = filtered.filter((product) =>
        product.collections.some(
          (coll) => coll.title.toLowerCase() === collection.toLowerCase()
        )
      );
    }

    // Apply min price filter
    const min = params.get("min");
    if (min) {
      filtered = filtered.filter((product) => product.price >= parseFloat(min));
    }

    // Apply max price filter
    const max = params.get("max");
    if (max) {
      filtered = filtered.filter((product) => product.price <= parseFloat(max));
    }

    // Apply color filter
    const color = params.get("color");
    if (color) {
      filtered = filtered.filter((product) =>
        product.color.some((c) => c.toLowerCase() === color.toLowerCase())
      );
    }

    // Apply Sort filter
    const sort = params.get("sort");
    if (sort) {
      const [direction, field] = sort.split(" ");
      const sortDirection = direction as "asc" | "desc";
      const sortField = field as keyof ProductType;

      filtered.sort((a, b) => {
        if (sortField === "createdAt") {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
        } else if (sortField === "title") {
          return sortDirection === "asc"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        } else if (
          typeof a[sortField] === "number" &&
          typeof b[sortField] === "number"
        ) {
          return sortDirection === "asc"
            ? a[sortField] - b[sortField]
            : b[sortField] - a[sortField];
        } else {
          return 0;
        }
      });
    }

    // Update the filtered products state
    setFilteredProducts(filtered);
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const params = new URLSearchParams(searchParams);
    params.set(name, value);
    console.log(`Updated Params: ${params.toString()}`);
    replace(`${pathname}?${params.toString()}`);
    filterProducts(params);
  };

  const handleResetFilters = () => {
    replace(pathname);
    setFilteredProducts(products);
  };

  useEffect(() => {
    filterProducts(new URLSearchParams(searchParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <>
      <form className="bg-sky-200 rounded-md px-8 py-4 grid gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center">
        {/* Season Type */}
        <select
          name="collection"
          id="collection"
          className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]"
          onChange={handleFilterChange}
          defaultValue={searchParams.get("name")?.toString()}
        >
          <option value="">Collection</option>
          <option value="summer">Summer</option>
          <option value="winter">Winter</option>
          <option value="casual">Casual</option>
          <option value="party">Party</option>
        </select>

        {/* prices */}
        <input
          type="text"
          name="min"
          placeholder="min price"
          className="text-xs rounded-2xl pl-2 w-36 h-8 ring-1 ring-gray-400"
          onChange={handleFilterChange}
          defaultValue={searchParams.get("name")?.toString()}
        />
        <input
          type="text"
          name="max"
          placeholder="max price"
          className="text-xs rounded-2xl pl-2 w-36 h-8 ring-1 ring-gray-400"
          onChange={handleFilterChange}
          defaultValue={searchParams.get("name")?.toString()}
        />

        {/* Colors */}
        <select
          name="color"
          id="color"
          className=" py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]"
          onChange={handleFilterChange}
          defaultValue={searchParams.get("name")?.toString()}
        >
          <option value="">Color</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="white">White</option>
          <option value="black">Black</option>
          <option value="yellow">Yellow</option>
          <option value="indigo">Indigo</option>
        </select>

        <select
          name="sort"
          id="sort"
          className=" py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]"
          onChange={handleFilterChange}
          defaultValue={searchParams.get("name")?.toString()}
        >
          <option value="">Sort By</option>
          <option value="asc price">Price(Low to High)</option>
          <option value="desc price">Price(High to Low)</option>
          <option value="desc createdAt">Newest</option>
          <option value="asc createdAt">Oldest</option>
          <option value="asc title">Sort(a - z)</option>
          <option value="desc title">Sort(z - a)</option>
        </select>

        {/* reset all filters */}
        <button
          type="button"
          onClick={handleResetFilters}
          className="w-32 h-12  px-3 py-4 bg-black text-white hover:bg-blue-500 hover:text-black rounded-lg"
        >
          Reset Filters
        </button>
      </form>

      {/* display filtered products here */}
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-20">
        {filterProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Suspense key={product._id} fallback={<ProductCardSkeleton />}>
              <ProductCard product={product} />
            </Suspense>
          ))
        ) : (
          <p>No products found matching the selected filters.</p>
        )}
      </div>
    </>
  );
};

export default Filters;
