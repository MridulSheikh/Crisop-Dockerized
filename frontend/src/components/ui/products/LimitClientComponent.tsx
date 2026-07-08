"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

const LimitSelectClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = searchParams.get("page") || 1;
  const currentLimit = searchParams.get("limit") || 12;
  const category = searchParams.get("category");

  const handleChange = (value: string) => {
    const params = new URLSearchParams();

    params.set("page", "1"); // reset page
    params.set("limit", value);

    if (category) {
      params.set("category", category);
      params.set("page",String(currentPage))
    }

    router.push(`?${params.toString()}`);
    router.refresh()
    console.log("hitted")
  };

  return (
    <Select defaultValue={String(currentLimit)} onValueChange={handleChange}>
      <SelectTrigger className="w-[80px]">
        <SelectValue placeholder="Limit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="10">10</SelectItem>
        <SelectItem value="12">12</SelectItem>
        <SelectItem value="15">15</SelectItem>
        <SelectItem value="20">20</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LimitSelectClient;