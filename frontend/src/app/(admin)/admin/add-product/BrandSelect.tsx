"use client";

import React, { useState } from "react";
import { TBrand } from "@/types/user";
import SelectCommand from "@/components/shared/command/SelectCommand";
import {
  useGetBrandsQuery,
  useGetSingleBrandQuery,
} from "@/redux/features/brand/brandApi";
import Image from "next/image";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const BrandSelect = ({ value, onChange }: Props) => {
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error } = useGetBrandsQuery({
    search,
  });

  const { data: selectedBrand } = useGetSingleBrandQuery(value, {
    skip: !value,
  });

  return (
    <SelectCommand<TBrand>
      selectedValue={(selectedBrand as any)?.data}
      label="Brand"
      value={value}
      onChange={onChange}
      data={data?.data?.data || []}
      isLoading={isLoading}
      isError={isError}
      error={error}
      onSearch={setSearch}
      getOptionValue={(b) => b._id}
      renderItem={(b) => (
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-md overflow-hidden">
            <Image
              src={b.img?.url || "/placeholder.png"}
              alt={b.name}
              fill
              className=" object-contain"
            />
          </div>

          <span className="font-medium">{b.name}</span>
        </div>
      )}
      renderSelectValue={(b) => (
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-md overflow-hidden">
            <Image
              src={b.img?.url || "/placeholder.png"}
              alt={b.name}
              fill
              className="object-contain"
            />
          </div>

          <span className="font-medium">{b.name}</span>
        </div>
      )}
    />
  );
};

export default BrandSelect;
