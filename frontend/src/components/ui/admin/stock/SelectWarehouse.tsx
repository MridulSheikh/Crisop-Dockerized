"use client";
import React, { useState } from "react";
import { Label } from "../../label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../command";
import { Button } from "../../button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { MdClose } from "react-icons/md";
import { useGetWarehouseQuery } from "@/redux/features/warehouse/warehouseApi";
import ErrorUi from "@/components/shared/error/ErrorUi";
import { LoadingUi } from "@/components/shared/loadingui/LoadingUi";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function SelectWarehouse({ value, onChange }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, error, isError } = useGetWarehouseQuery(
    { search: searchTerm, limit:100 },
    {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    },
  );

  const warehouses = data?.data;
  
  console.log(warehouses)
  console.log(value)

  const selectedData = warehouses?.data?.find((wh) => wh._id === value)

  console.log(selectedData)

  return (
    <div>
      <Label className="block mb-1">Warehouse</Label>
      {!value && (
        <Command
          className="w-full border rounded-lg"
          shouldFilter={false}
        >
          <CommandInput
            placeholder="Search warehouse..."
            value={searchTerm}
            onValueChange={(value) => setSearchTerm(value)}
          />
          <CommandList>
            <CommandGroup>
              {isError && <ErrorUi error={error} />}
              {isLoading ? (
                <div className=" w-full flex justify-center items-center">
                  <LoadingUi />
                </div>
              ) : (
                <>
                  {warehouses?.data?.length === 0 && (
                    <CommandEmpty>No warehouse found.</CommandEmpty>
                  )}
                </>
              )}
              {warehouses?.data?.map((wh) => (
                <CommandItem
                  key={wh?._id}
                  value={wh?._id}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === wh._id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {wh.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      )}

      {value && (
        <div className="w-full rounded-lg border flex justify-between">
          <p className="text-muted-foreground px-2 py-2">
            {warehouses?.data?.find((wh) => wh._id === value)?.name}
          </p>
          <Button variant={"ghost"} onClick={() => onChange("")}>
            <MdClose />
          </Button>
        </div>
      )}
    </div>
  );
}
