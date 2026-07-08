"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useGetBrandsQuery } from "@/redux/features/brand/brandApi";
import { TBrand } from "@/types/user";

const BrandFilter = ({ className }: { className?: string }) => {
  const { data, isLoading } = useGetBrandsQuery({ limit: 100 });
  const brand = data?.data?.data || [];

  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedBrand = searchParams.get("brand")?.split(",") || [];

  const handlebregory = (id: string) => {
    let updated = [...selectedBrand];

    if (updated.includes(id)) {
      updated = updated.filter((c) => c !== id);
    } else {
      updated.push(id);
    }

    const params = new URLSearchParams(searchParams.toString());

    if (updated.length) {
      params.set("brand", updated.join(","));
    } else {
      params.delete("brand");
    }

    router.push(`?${params.toString()}`);
    router.refresh();
  };

  return (
    <div className={cn("w-60 p-4 bg-background rounded-m", className)}>
      <h2 className="font-semibold mb-4">Brand</h2>

      {isLoading ? (
        <p className="text-sm">Loading...</p>
      ) : (
        <div className="space-y-3">
          {brand.map((br: TBrand) => (
            <label
              key={br._id}
              className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-md transition-all duration-200 ease-in-out  hover:bg-muted/60 hover:pl-3"
            >
              <Checkbox
                checked={selectedBrand.includes(br._id)}
                onCheckedChange={() => handlebregory(br._id)}
                className="data-[state=checked]:bg-green-600
             data-[state=checked]:border-green-700
             data-[state=checked]:text-white"
              />
              <span className="text-sm">{br.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandFilter;
