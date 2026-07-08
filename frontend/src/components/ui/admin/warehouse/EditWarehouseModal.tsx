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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useUpdateWareHouseMutation } from "@/redux/features/warehouse/warehouseApi";
import { toast } from "react-toastify";

// Schema
const warehouseSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1 unit"),
});

type WarehouseFormValues = z.infer<typeof warehouseSchema>;

type EditWarehouseProps = {
  initialData: WarehouseFormValues;
};

export default function EditWarehouse({ initialData }: EditWarehouseProps) {
  const [open, setOpen] = useState(false);
  const [updateWarehouse] = useUpdateWareHouseMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: WarehouseFormValues) => {
     const toastId = toast.loading("updating warehouse...");
        try {
          const response = await updateWarehouse({id: initialData._id as string, data}).unwrap();
          // update the existing loading toast into success
          toast.update(toastId, {
            render: response.data.message,
            type: "success",
            isLoading: false,
            autoClose: 3000,
            position: "top-center",
          });
       
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          toast.update(toastId, {
            render:
              error?.data?.errorMessage ??
              "Something went wrong!",
            type: "error",
            isLoading: false,
            autoClose: 4000,
            position: "top-center",
          });
        }
        setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size={"sm"} className="text-green-600 hover:underline">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Warehouse</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...register("location")} />
            {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location.message}</p>}
          </div>

          <div>
            <Label htmlFor="capacity">Capacity (units)</Label>
            <Input id="capacity" type="number" {...register("capacity")} />
            {errors.capacity && <p className="text-sm text-red-500 mt-1">{errors.capacity.message}</p>}
          </div>

          <DialogFooter className="pt-4">
            <Button type="submit">Update</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
