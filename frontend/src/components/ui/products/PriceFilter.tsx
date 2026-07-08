"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  minLimit?: number;
  maxLimit?: number;
  className?: string;
};

export default function PriceFilter({
  minLimit = 0,
  maxLimit = 4000,
  className
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlMin = Number(searchParams.get("min")) || minLimit;
  const urlMax = Number(searchParams.get("max")) || maxLimit;

  const [value, setValue] = React.useState<[number, number]>([
    urlMin,
    urlMax,
  ]);

  React.useEffect(() => {
    setValue([urlMin, urlMax]);
  }, [urlMin, urlMax]);

  const updateURL = (min: number, max: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("min", String(min));
    params.set("max", String(max));

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleApply = () => {
    let min = value[0];
    let max = value[1];

    if (min > max) [min, max] = [max, min];

    setValue([min, max]);
    updateURL(min, max);
  };

  const handleReset = () => {
    setValue([minLimit, maxLimit]);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("min");
    params.delete("max");

    router.push(`?${params.toString()}`, { scroll: false });
  };


  return (
    <div className={cn("w-full max-w-60 bg-white shadow-sm p-5 space-y-5", className)}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-800">
            Price Filter
          </h2>
        </div>

        <div className="text-sm font-medium text-green-600">
          ${value[0]} - ${value[1]}
        </div>
      </div>

      {/* Slider */}
      <div className="px-1">
        <Slider
          min={minLimit}
          max={maxLimit}
          step={1}
          value={value}
          onValueChange={(val) => setValue(val as [number, number])}
          className="w-full"
        />
      </div>

      {/* Inputs */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1">Min</p>
          <Input
            type="number"
            value={value[0]}
            onChange={(e) =>
              setValue([Number(e.target.value || 0), value[1]])
            }
            className="rounded-lg"
          />
        </div>

        <span className="text-gray-400 mt-5">—</span>

        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1">Max</p>
          <Input
            type="number"
            value={value[1]}
            onChange={(e) =>
              setValue([value[0], Number(e.target.value || 0)])
            }
            className="rounded-lg"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          onClick={handleApply}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl"
        >
          Apply Filter
        </Button>

        <Button
          onClick={handleReset}
          variant="outline"
          className="flex-1 rounded-xl border-gray-300"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}