"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useGetCategoryQuery } from "@/redux/features/category/categoryApi";
import { TCategory } from "@/types/user";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const CategorySidebar = ({className} : {className?:string}) => {
  const { data, isLoading } = useGetCategoryQuery({ limit: 100 });
  const categories = data?.data?.data || [];

  const router = useRouter();
  const searchParams = useSearchParams();

  const currentLimit = searchParams.get("limit") || "10";

  const selectedCategories = searchParams.get("category")?.split(",") || [];

  const handleCategory = (id: string) => {
    let updated = [...selectedCategories];

    if (updated.includes(id)) {
      updated = updated.filter((c) => c !== id);
    } else {
      updated.push(id);
    }

    const params = new URLSearchParams(searchParams.toString());

    params.set("page", "1");
    params.set("limit", currentLimit);

    if (updated.length) {
      params.set("category", updated.join(","));
    } else {
      params.delete("category");
    }

    router.push(`?${params.toString()}`);
    router.refresh();
  };

  return (
    <div className={cn("w-60 p-4 bg-background rounded-m", className)}>
      <h2 className="font-semibold mb-4">Categories</h2>

      {isLoading ? (
        <p className="text-sm">Loading...</p>
      ) : (
        <div className="space-y-3">
          {categories.map((cat: TCategory) => (
            <label
              key={cat._id}
              className="
    flex items-center gap-2 cursor-pointer
    px-2 py-1 rounded-md
    transition-all duration-200 ease-in-out
    hover:bg-muted/60
    hover:pl-3
  "
            >
              <Checkbox
                checked={selectedCategories.includes(cat._id)}
                onCheckedChange={() => handleCategory(cat._id)}
                className="data-[state=checked]:bg-green-600
             data-[state=checked]:border-green-700
             data-[state=checked]:text-white"
              />
              <span className="text-sm">{cat.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategorySidebar;
