import { Input } from "@/components/ui/input";
import React, { ChangeEvent } from "react";

interface IProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
}

const SearchInput = ({ searchQuery, setSearchQuery, placeholder }: IProps) => {
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };
  return (
    <Input
      type="search"
      className=""
      placeholder={placeholder}
      value={searchQuery}
      onChange={handleSearch}
    />
  );
};

export default SearchInput;
