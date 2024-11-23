"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProductType } from "@/lib/types";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { useDebounce } from "@/lib/hooks/useDebounce";

interface FilterProps {
  products: ProductType[];
}

const Filters = ({ products }: FilterProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [min, setMin] = useState(searchParams.get("min") || "");
  const [max, setMax] = useState(searchParams.get("max") || "");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 6; // change in production
  const start = (currentPage - 1) * productsPerPage;
  const end = start + productsPerPage;

  const debouncedMin = useDebounce(min, 500);
  const debouncedMax = useDebounce(max, 500);

  // filtering of products
  const filterProducts = useCallback(
    (params: URLSearchParams) => {
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

      if (debouncedMin) {
        filtered = filtered.filter(
          (product) => product.price >= parseFloat(debouncedMin)
        );
      }

      // Apply max price filter

      if (debouncedMax) {
        filtered = filtered.filter(
          (product) => product.price <= parseFloat(debouncedMax)
        );
      }

      // Apply color filter
      const color = params.get("color");
      if (color) {
        filtered = filtered.filter((product) => {
          if (!Array.isArray(product.color)) {
            // console.log(
            //   `Skipping product ${product.title}: invalid color format.`
            // );
            return false;
          }
          const matches = product.color.some(
            (c) => c.toLowerCase() === color.toLowerCase()
          );
          // console.log(
          //   `Product: ${product.title}, Matches: ${matches}, Colors: ${product.color}`
          // );
          return matches;
        });
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
      setCurrentPage(1);
    },
    [debouncedMax, debouncedMin, products]
  );

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const params = new URLSearchParams(searchParams);

    if (name === "min") {
      setMin(value);
    } else if (name === "max") {
      setMax(value);
    }

    params.set(name, value);
    console.log(`Updated Params: ${params.toString()}`);
    replace(`${pathname}?${params.toString()}`);
    filterProducts(params);
  };

  const handleResetFilters = () => {
    replace(pathname);
    setFilteredProducts(products);
    setCurrentPage(1);
  };

  useEffect(() => {
    filterProducts(new URLSearchParams(searchParams));
  }, [filterProducts, searchParams, debouncedMin, debouncedMax]);

  // Paginate filtered products
  const paginatedProducts = filteredProducts.slice(start, end);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <>
      <form className="bg-sky-200 rounded-md px-8 py-4 grid gap-x-4 gap-y-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center">
        {/* Season Type */}
        <div className="flex flex-col">
          <label
            htmlFor="collection"
            className="block text-sm font-medium text-gray-700 pl-2 mb-1"
          >
            Collection
          </label>
          <select
            name="collection"
            id="collection"
            className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED] w-full sm:w-9/12 md:w-3/5 lg:w-48"
            onChange={handleFilterChange}
            defaultValue={searchParams.get("name")?.toString()}
          >
            <option value="">Collection</option>
            <option value="summer">Summer</option>
            <option value="winter">Winter</option>
            <option value="casual">Casual</option>
            <option value="party">Party</option>
          </select>
        </div>

        {/* prices */}
        <div className="flex flex-col">
          <label
            htmlFor="min"
            className="block text-sm font-medium text-gray-700 pl-2 mb-1"
          >
            Min Price
          </label>
          <input
            type="text"
            name="min"
            placeholder="min price"
            className="text-xs rounded-2xl pl-2  h-8 ring-1 ring-gray-400 w-full sm:w-9/12 md:w-3/5 lg:w-48"
            onChange={handleFilterChange}
            defaultValue={searchParams.get("name")?.toString()}
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="max"
            className="block text-sm font-medium text-gray-700 pl-2 mb-1"
          >
            Max Price
          </label>
          <input
            type="text"
            name="max"
            placeholder="max price"
            className="text-xs rounded-2xl h-8 pl-2 ring-1 ring-gray-400 w-full sm:w-9/12 md:w-3/5 lg:w-48"
            onChange={handleFilterChange}
            defaultValue={searchParams.get("name")?.toString()}
          />
        </div>

        {/* Colors */}
        <div className="flex flex-col">
          <label
            htmlFor="color"
            className="block text-sm font-medium text-gray-700 pl-2 mb-1"
          >
            Color
          </label>
          <select
            name="color"
            id="color"
            className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED] w-full sm:w-9/12 md:w-3/5 lg:w-48"
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
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="sort"
            className="block text-sm font-medium text-gray-700 pl-2 mb-1"
          >
            Sort By
          </label>
          <select
            name="sort"
            id="sort"
            className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED] w-full sm:w-9/12 md:w-3/5 lg:w-48"
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
        </div>

        {/* reset all filters */}
        <button
          type="button"
          onClick={handleResetFilters}
          className="h-12 px-3 py-2 bg-black text-white hover:bg-blue-500 hover:text-black rounded-lg w-full sm:w-9/12 md:w-3/5 lg:w-48"
        >
          Reset Filters
        </button>
      </form>

      {/* display filtered products here */}
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-20">
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((product) => (
            <Suspense key={product._id} fallback={<ProductCardSkeleton />}>
              <ProductCard product={product} />
            </Suspense>
          ))
        ) : (
          <p>No products found matching the selected filters.</p>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-10">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className={`px-4 py-2 rounded-lg ${
            currentPage === 1
              ? "bg-gray-300"
              : "bg-black hover:bg-green-800 text-white"
          }`}
        >
          Previous
        </button>
        <span className="px-4 py-2 mx-2 bg-gray-100 rounded-lg">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className={`px-4 py-2 rounded-lg ${
            currentPage === totalPages
              ? "bg-gray-300"
              : "bg-black hover:bg-green-800 text-white"
          }`}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default Filters;
