"use client";

import React, { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Props<T> = {
  label: string;
  value: string;
  onChange: (value: string) => void;

  data: T[];
  isLoading: boolean;
  isError?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;

  getOptionValue: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
  onSearch: (value: string) => void;
  renderSelectValue: (item: T) => React.ReactNode;
  selectedValue: T,
};

function SelectCommand<T>({
  label,
  value,
  onChange,
  data,
  isLoading,
  isError,
  error,
  getOptionValue,
  renderItem,
  onSearch,
  renderSelectValue,
  selectedValue
}: Props<T>) {
  const [search, setSearch] = useState("");

  return (
    <div>
      <Label className="block mb-1">{label}</Label>

      {!value && (
        <Command shouldFilter={false} className="relative w-full border rounded-lg overflow-visible">
          <CommandInput
            placeholder={`Search ${label}`}
            value={search}
            onValueChange={(val) => {
              setSearch(val);
              onSearch(val); // 🔥 parent control search
            }}
          />
          {search && (
            <CommandList className="max-h-60 overflow-y-auto bg-white border rounded-lg shadow-lg absolute left-0 right-0 top-full mt-1 z-50">
              <CommandGroup>
                {isError && (
                  <p className="text-red-500 text-center p-5">{error?.data?.errorMessage || "Something went wrong"}</p>
                )}

                {isLoading && <p className="p-2 text-center">Loading...</p>}

                {!isLoading && data.length === 0 && (
                  <CommandEmpty>No results found</CommandEmpty>
                )}

                {(!isError || isLoading) && data?.map((item) => {
                  const id = getOptionValue(item);
                  return (
                    <CommandItem
                      key={id}
                      value={id}
                      onSelect={(v) => onChange(v === value ? "" : v)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === id ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {renderItem(item)}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          )}
        </Command>
      )}

      {value && selectedValue && (
        <div className="flex justify-between border rounded-lg px-3 py-2 bg-white">
          {renderSelectValue(selectedValue)}
          <button onClick={() => onChange("")}>✕</button>
        </div>
      )}
    </div>
  );
}

export default SelectCommand;
