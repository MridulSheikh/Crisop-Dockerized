"use client";

import React, { useState } from "react";
import SelectCommand from "@/components/shared/command/SelectCommand";

type TCategory = {
  _id: string;
  name: string;
  description: string;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
};

import { useGetCategoryQuery, useGetSingleCategoryQuery } from "@/redux/features/category/categoryApi";

const CategorySelect = ({ value, onChange }: Props) => {
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error } = useGetCategoryQuery({
    search,
  });

  const categories: TCategory[] = data?.data?.data || [];

   const { data: selectedCategory } = useGetSingleCategoryQuery(value, {
      skip: !value,
    });

  return (
    <SelectCommand<TCategory>
      selectedValue={selectedCategory?.data}
      label="Category"
      value={value}
      onChange={onChange}
      data={categories}
      isLoading={isLoading}
      isError={isError}
      error={error}
      onSearch={setSearch}
      
      // 🔑 unique value
      getOptionValue={(c) => c._id}

      // 🔽 dropdown item UI
      renderItem={(c) => (
        <div className="flex flex-col">
          <span className="font-medium">{c.name}</span>
        </div>
      )}

      // ✅ selected UI
      renderSelectValue={(c) => (
        <div className="flex flex-col">
          <span className="font-medium">{c.name}</span>
        </div>
      )}
    />
  );
};

export default CategorySelect;