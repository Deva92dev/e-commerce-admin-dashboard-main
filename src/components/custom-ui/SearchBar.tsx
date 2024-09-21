"use client";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// use search params in this with debounce
const SearchBar = () => {
  const router = useRouter();
  const [query, setQuery] = useState(" ");

  return (
    <div className="flex border gap-3 border-gray-200 bg-gray-100 py-3 px-2 items-center rounded-lg">
      <input
        className="outline-none max-sm:max-w-[120px]"
        placeholder="search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        disabled={query === ""}
        onClick={() => router.push(`/search/${query}`)}
      >
        <Search className="cursor-pointer h-4 w-4" />
      </button>
    </div>
  );
};

export default SearchBar;
