"use client";

import React, { useState } from "react";
import { useGetSingleStockQuery, useGetStockQuery } from "@/redux/features/warehouse/stockApi";
import { TStock } from "@/types/user";
import SelectCommand from "@/components/shared/command/SelectCommand";
import UpdateStock from "@/components/ui/admin/stock/UpdateStockModal";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const StockSelect = ({ value, onChange }: Props) => {
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error } = useGetStockQuery({
    search,
  });

   const { data: selectedStock } = useGetSingleStockQuery(value, {
    skip: !value,
  });

  return (
    <SelectCommand<TStock>
      selectedValue={selectedStock?.data}
      label="Stock"
      value={value}
      onChange={onChange}
      data={data?.data?.data || []} 
      isLoading={isLoading}
      isError={isError}
      error={error}
      onSearch={setSearch}
      getOptionValue={(s) => s._id}
      renderItem={(s) => (
        <div className="flex flex-col">
          <span className="font-medium">
            {s.productName} - {s.warehouse?.name}
          </span>
          <span className="text-sm text-muted-foreground">
            Qty: {s.quantity} {s.unit}
          </span>
        </div>
      )}
      renderSelectValue={(s) => (
        <div className=" flex justify-between items-center w-full">
          <div className="flex flex-col">
              <span className="font-medium">
            {s.productName} - {s.warehouse?.name}
          </span>
          <span className="text-sm text-muted-foreground">
            Qty: {s.quantity} {s.unit}
          </span>
            </div>       
        
             <UpdateStock stock={s} />
        </div>
      )}
    />
  );
};

export default StockSelect;