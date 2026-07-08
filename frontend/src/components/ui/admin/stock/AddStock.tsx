"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useAddStocksMutation } from "@/redux/features/warehouse/stockApi";
import { toast } from "react-toastify";
import { SelectWarehouse } from "./SelectWarehouse";
import AddWarehouse from "../warehouse/AddWarehouse";
import { TStock } from "@/types/user";

// Schema 
const stockSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  warehouse: z.string().min(1, "Select a warehouse"),
  unit: z.string().min(1, "Select a unit"),
});

type StockFormValues = z.infer<typeof stockSchema>;


export default function AddStock() {
  const [open, setOpen] = useState(false);
  const [addStock] = useAddStocksMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<StockFormValues>({
    resolver: zodResolver(stockSchema),
    defaultValues: {
      productName: "",
      quantity: 1,
      warehouse: "",
      unit: "",
    },
  });

  // onSubmit
  const onSubmit = async (data: StockFormValues) => {
    const toastId = toast.loading("Adding Stock...");

    try {
      const response = await addStock(data as Omit<TStock, "_id" | "sku" | "isDeleted">&{warehouse : string}).unwrap();

      toast.update(toastId, {
        render: response?.data?.message || "Stock added successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        position: "top-center",
      });

      reset();
      setOpen(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.update(toastId, {
        render:
          error?.data?.errorMessage ||
          error?.data?.message ||
          "Something went wrong!",
        type: "error",
        isLoading: false,
        autoClose: 4000,
        position: "top-center",
      });
    }
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-black text-white px-4 py-2 text-sm rounded-md hover:opacity-90">
          + Add Stock
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md ">
        <DialogHeader>
          <DialogTitle>Add Stock</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2 flex flex-col">
          {/* Product Name */}
          <div>
            <Label htmlFor="product">Product Name</Label>
            <Input
              id="product"
              {...register("productName")}
              placeholder="e.g., Rice 50kg"
            />
            {errors.productName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.productName.message}
              </p>
            )}
          </div>

          {/* Quantity */}
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              {...register("quantity")}
              placeholder="100"
            />
            {errors.quantity && (
              <p className="text-sm text-red-500 mt-1">
                {errors.quantity.message}
              </p>
            )}
          </div>

          {/* Warehouse Select */}
          <div>
            <Controller
              name="warehouse"
              control={control}
              render={({ field }) => (
                <SelectWarehouse
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.warehouse && (
              <p className="text-sm text-red-500 mt-1">
                {errors.warehouse.message}
              </p>
            )}
          </div>

          <AddWarehouse />

          {/* Unit Select */}
          <div>
            <Label>Unit</Label>

            <Controller
              name="unit"
              control={control}
              render={({ field }) => (
                <select
                  value={field.value}
                  onChange={field.onChange}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="g">Gram (g)</option>
                  <option value="piece">Piece</option>
                  <option value="liter">Liter</option>
                  <option value="box">Box</option>
                  <option value="packet">Packet</option>
                </select>
              )}
            />

            {errors.unit && (
              <p className="text-sm text-red-500 mt-1">
                {errors.unit.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <DialogFooter className="pt-4">
            <Button type="submit" className="w-full">
              Add Stock
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}