"use client";

import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { Button } from "../button";
import { Search, Loader2, X, Link, ArrowUpLeft } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { TProduct } from "@/types/user";
import { useGetProductQuery } from "@/redux/features/product/productApi";
import { MdClose } from "react-icons/md";

type Props = {
  onFocus?: () => void;
  onBlur?: () => void;
  isFocused?: boolean;
};

const ProductSearchBar = ({ onFocus, onBlur, isFocused }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const initialQuery = searchParams.get("searchTerm") || "";

  const [query, setQuery] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const { data, isFetching } = useGetProductQuery(
    { search: query, limit: 5 },
    { skip: query.length === 0 },
  );

  const products = data?.data || [];

  const goToShop = (paramsString: string) => {
    if (onBlur != undefined) {
      onBlur();
    }
    router.push(`/shop?${paramsString}`);
  };

  const handleSuggestionClick = (title: string) => {
    setQuery(title);
    setShowSuggestions(false);

    const params = new URLSearchParams();
    params.set("searchTerm", title);

    goToShop(params.toString());
  };

  const handleSearch = () => {
    if (!query.trim()) return;

    setShowSuggestions(false);

    const params = new URLSearchParams();
    params.set("searchTerm", query);

    goToShop(params.toString());
  };

  const handleClear = () => {
    setQuery("");
    if (onBlur != undefined) {
      onBlur();
    }
    setShowSuggestions(false);
    if(initialQuery.length === 0) return;
    router.push(pathname);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="relative w-full mx-auto flex items-center">
      {/* SEARCH BOX */}
      <div className="flex items-center bg-white border border-gray-300 rounded-full overflow-hidden lg:rounded-md shadow-sm w-full focus-within:ring-1 focus-within:ring-green-600 focus-within:border-green-600 transition">
        <div className="pl-4 text-gray-500">
          <FiSearch />
        </div>

        <input
          className="w-full px-3 py-3 outline-none text-sm"
          placeholder="Search in crisop"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            onFocus?.();
            if (query.length > 0) setShowSuggestions(true);
          }}
        />

        {query && (
          <button
            onClick={handleClear}
            className="p-2 text-gray-400 hover:text-red-500 hidden xl:inline-block"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* CANCEL BUTTON (Mobile only) */}
      {isFocused && (
        <button onClick={handleClear} className="ml-2 text-sm xl:hidden">
          <MdClose size={30} />
        </button>
      )}

      {/* SUGGESTIONS */}
      {showSuggestions && query.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-md mt-1 shadow-md max-h-60 overflow-y-auto top-full left-0">
          <li
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center gap-2"
            onClick={handleSearch}
          >
            <Search size={14} /> Search &quot;{query}&quot;
          </li>
          {isFetching ? (
            <li className="px-4 py-2 text-sm text-gray-500 flex items-center gap-2">
              <Loader2 className="animate-spin" size={15} />
              Loading...
            </li>
          ) : (
            products.length > 0 &&
            products.map((item: TProduct, index: number) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(item.name)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center gap-2"
              >
                <ArrowUpLeft size={14} />
                {item.name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default ProductSearchBar;
