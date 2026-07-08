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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

// Schema
const couponSchema = z.object({
  code: z.string().min(1, "Coupon code is required"),
  discount: z
    .coerce.number()
    .min(1, "Must be at least 1%")
    .max(100, "Cannot exceed 100%"),
  expiry: z.string().min(1, "Expiry date is required"),
  MaxUsed: z.coerce.number().optional(),
});

type CouponFormValues = z.infer<typeof couponSchema>;

type AddCouponProps = {
  onAdd: (data: CouponFormValues) => void;
};

export default function AddCoupon({ onAdd }: AddCouponProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
      discount: 10,
      expiry: "",
      MaxUsed: undefined,
    },
  });

  const onSubmit = (data: CouponFormValues) => {
    onAdd(data);
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-black text-white text-sm px-4 py-2 rounded-md hover:opacity-90">
         + Add Coupon
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Coupon</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div>
            <Label htmlFor="code">Coupon Code</Label>
            <Input id="code" {...register("code")} placeholder="e.g., SAVE20" />
            {errors.code && (
              <p className="text-sm text-red-500 mt-1">{errors.code.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="discount">Discount (%)</Label>
            <Input
              id="discount"
              type="number"
              {...register("discount")}
              placeholder="10"
            />
            {errors.discount && (
              <p className="text-sm text-red-500 mt-1">{errors.discount.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="expiry">Expiry Date</Label>
            <Input
              id="expiry"
              type="date"
              {...register("expiry")}
            />
            {errors.expiry && (
              <p className="text-sm text-red-500 mt-1">{errors.expiry.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="MaxUsed">How many time can be used (optional)</Label>
            <Input
              id="MaxUsed"
              type="number"
              {...register("MaxUsed")}
              placeholder="e.g., 1000"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="submit">Create Coupon</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
