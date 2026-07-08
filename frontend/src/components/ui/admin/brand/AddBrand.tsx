"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "react-toastify";
import { useCreateBrandMutation } from "@/redux/features/brand/brandApi";
import ImgUpload from "@/components/shared/imgUpload/ImgUpload";

const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  logo: z.array(z.custom<File>()).default([]),
});

type BrandFormValues = z.input<typeof brandSchema>;

export default function AddBrand() {
  const [open, setOpen] = useState(false);
  const [createBrand] = useCreateBrandMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      logo: [],
    },
  });

  const onSubmit = async (data: BrandFormValues) => {
    const toastId = toast.loading("Creating brand...");
    const formData = new FormData();

    formData.append("name", data.name);
    if (data.logo?.[0]) {
      formData.append("img", data.logo[0]);
    }

    try {
      await createBrand(formData).unwrap();

      toast.update(toastId, {
        render: "Brand created successfully",
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
        <Button className="bg-black text-white text-sm px-4 py-2 rounded-md hover:opacity-90">
          + Add Brand
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Brand</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label>Logo</Label>
            <Controller
              name="logo"
              control={control}
              render={({ field }) => (
                <ImgUpload
                  value={field.value}
                  onChange={field.onChange}
                  max_file={1}
                />
              )}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="submit">Create Brand</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
