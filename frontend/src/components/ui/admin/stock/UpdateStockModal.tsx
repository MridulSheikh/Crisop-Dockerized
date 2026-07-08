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
import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { SelectWarehouse } from "./SelectWarehouse";
import { useUpdateStocksMutation } from "@/redux/features/warehouse/stockApi";
import { toast } from "react-toastify";
import { TStock } from "@/types/user";


const stockSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  warehouse: z.string().min(1, "Select a warehouse"),
  unit: z.string().min(1, "Select a unit"),
});

type StockFormValues = z.infer<typeof stockSchema>;

type UpdateStockProps = {
  stock: TStock;
};

export default function UpdateStock({ stock }: UpdateStockProps) {
  const [open, setOpen] = useState(false);
  const [updateStock] = useUpdateStocksMutation();

  const defaultValue = {
    productName: stock.productName,
    quantity: stock.quantity,
    warehouse:stock.warehouse._id,
    unit: stock.unit
  }

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<StockFormValues>({
    resolver: zodResolver(stockSchema),
    defaultValues: defaultValue,
  });
  
  // when modal open
  useEffect(() => {
    if (open) reset(defaultValue);
  }, [open, stock, reset]);

  const onSubmit = async (data: StockFormValues) => {
    const toastId = toast.loading("Updating stock...");
    try {
      const response = await updateStock({ id: stock._id, data }).unwrap();
      toast.update(toastId, {
        render: response?.data?.message || "Stock updated successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        position: "top-center",
      });
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
        <Button variant="ghost">
          <Pencil size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Stock</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
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

          {/* Warehouse */}
          <div>
            <Controller
              name="warehouse"
              control={control}
              defaultValue={defaultValue.warehouse}
              render={({ field }) => (
                <SelectWarehouse value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.warehouse && (
              <p className="text-sm text-red-500 mt-1">
                {errors.warehouse.message}
              </p>
            )}
          </div>

          {/* Unit */}
          <div>
            <Label>Unit</Label>
            <Controller
              name="unit"
              control={control}
              defaultValue={defaultValue.unit}
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
              <p className="text-sm text-red-500 mt-1">{errors.unit.message}</p>
            )}
          </div>

          {/* Submit */}
          <DialogFooter className="pt-4">
            <Button type="submit" className="w-full">
              Update Stock
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}