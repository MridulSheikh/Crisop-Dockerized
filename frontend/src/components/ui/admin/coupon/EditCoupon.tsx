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
import { useState, useEffect } from "react";
import { Edit } from "lucide-react";

// Schema (similar to AddCoupon but can tweak if needed)
const couponSchema = z.object({
  code: z.string().min(1, "Coupon code is required"),
  discount: z.coerce
    .number()
    .min(1, "Must be at least 1%")
    .max(100, "Cannot exceed 100%"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  MaxUses: z.coerce.number().optional(),
});

type CouponFormValues = z.infer<typeof couponSchema>;

type EditCouponProps = {
  coupon: CouponFormValues & { id: string }; // pass existing coupon with id
  onEdit: (id: string, data: CouponFormValues) => void;
};

export default function EditCoupon({ coupon, onEdit }: EditCouponProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: coupon.code,
      discount: coupon.discount,
      expiryDate: coupon.expiryDate,
      MaxUses: coupon.MaxUses,
    },
  });

  // Reset form if coupon changes or dialog reopens
  useEffect(() => {
    reset({
      code: coupon.code,
      discount: coupon.discount,
      expiryDate: coupon.expiryDate,
      MaxUses: coupon.MaxUses,
    });
  }, [coupon, reset]);

  const onSubmit = (data: CouponFormValues) => {
    onEdit(coupon.id, data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          size={"sm"}
          className="text-green-600  text-sm px-4 py-2 rounded-md hover:opacity-90"
        >
          <Edit size={16} />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Coupon</DialogTitle>
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
              <p className="text-sm text-red-500 mt-1">
                {errors.discount.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="expiry">Expiry Date</Label>
            <Input id="expiry" type="date" {...register("expiryDate")} />
            {errors.expiryDate && (
              <p className="text-sm text-red-500 mt-1">
                {errors.expiryDate.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="MaxUsed">
              How many times can be used (optional)
            </Label>
            <Input
              id="MaxUsed"
              type="number"
              {...register("MaxUses")}
              placeholder="e.g., 1000"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="submit">Update Coupon</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
