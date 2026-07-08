import ProductCard from "@/components/shared/card/ProductCard";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import BrandFilter from "@/components/ui/products/BrandFilter";
import LimitSelectClient from "@/components/ui/products/LimitClientComponent";
import MobileFilter from "@/components/ui/products/MobileShopFilter";
import PriceFilter from "@/components/ui/products/PriceFilter";
import CategorySidebar from "@/components/ui/products/SelectCategorySidebar";
import { TProduct } from "@/types/user";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

const Products = async ({
  searchParams,
}: {
  searchParams: {
    page?: string;
    limit?: string;
    category?: string;
    searchTerm?: string;
    min?: string;
    max?: string;
    brand?: string;
  };
}) => {
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 12;
  const minPrice = searchParams.min;
  const maxPrice = searchParams.max;
  const category = searchParams.category;
  const brand = searchParams.brand;
  const searchTerm = searchParams.searchTerm;
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const url = `${process.env.NEXT_PUBLIC_API_URL}/product?page=${page}&limit=${limit}${
    category ? `&category=${category}` : ""
  }${searchTerm ? `&searchTerm=${searchTerm}` : ""}${minPrice ? `&minPrice=${minPrice}` : ""}${maxPrice ? `&maxPrice=${maxPrice}` : ""}${brand ? `&brand=${brand}` : ""}`;
  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const products = await res.json();
  const meta = products.meta;

  return (
    <div className="bg-[#f6f6f6] pb-10 lg:py-20">
      <div className="max-w-screen-2xl mx-auto h-72 lg:h-96 lg:rounded-md flex items-center relative overflow-hidden">
        {/* background image */}
        <Image
          src="/img/bag-banner.jpg"
          alt="banner"
          fill
          className="object-cover object-bottom"
          priority
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

        {/* content */}
        <div className="relative px-10 max-w-lg text-white space-y-4">
          <p className="text-green-400 font-semibold tracking-widest uppercase text-sm">
            Fresh Collection 2026
          </p>

          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            Organic & Fresh Grocery Products
          </h1>

          <p className="text-sm md:text-base text-gray-200">
            Discover premium quality groceries, fresh fish, meat and daily
            essentials delivered straight to your door.
          </p>
        </div>
      </div>
      <div className="max-w-screen-2xl px-5 mx-auto pt-10">
        <div className="flex justify-between items-center">
          <div className="flex gap-x-4 items-center">
            <MobileFilter />
            <p className="text-sm flex items-center gap-x-2">
              Showing <LimitSelectClient /> of {meta?.total} items
            </p>
          </div>
        </div>
        <div className=" flex flex-col xl:flex-row gap-x-5 mt-[34px] w-full">
          <div className="hidden shadow-sm xl:block">
            <CategorySidebar />
            <PriceFilter />
            <BrandFilter />
          </div>
          <div className="w-full">
            {products?.data?.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full">
                  {products.data.map((product: TProduct) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                <div className="mt-10">
                  <PaginationWithLinks
                    page={meta?.page}
                    pageSize={meta?.limit}
                    totalCount={meta?.total}
                  />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center w-full h-full">
                {/* illustration */}
                <div className="w-40 h-40 mb-6 opacity-80">
                  <Image
                    src="/img/product-not-found.png"
                    alt="No products"
                    fill
                    className="object-contain"
                  />
                </div>

                {/* title */}
                <h2 className="text-2xl font-semibold text-gray-800">
                  No Products Found
                </h2>

                {/* subtitle */}
                <p className="text-sm text-gray-500 mt-2 max-w-md">
                  We couldn’t find any products matching your filters or search.
                  Try adjusting category, price range, or brand.
                </p>

                {/* CTA button (optional but PRO UX) */}
                <Link
                  href="/shop"
                  className="mt-6 px-5 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
                >
                  Reset Filters
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
