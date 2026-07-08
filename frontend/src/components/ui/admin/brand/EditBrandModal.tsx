"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { TBrand } from "@/types/user";
import { useUpdateBrandMutation } from "@/redux/features/brand/brandApi";
import ImgUpload from "@/components/shared/imgUpload/ImgUpload";
import Image from "next/image";

const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  logo: z.array(z.custom<File>()).default([]),
});

type BrandFormValues = z.input<typeof brandSchema>;

interface EditBrandModalProps {
  brand: TBrand;
}

const getBrandImageUrl = (brand: TBrand) =>
  typeof brand.img === "string" ? brand.img : brand.img?.url;

export default function EditBrandModal({ brand }: EditBrandModalProps) {
  const [open, setOpen] = useState(false);
  const [updateBrand] = useUpdateBrandMutation();
  const currentImageUrl = getBrandImageUrl(brand);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: brand?.name,
      logo: [],
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: brand?.name,
        logo: [],
      });
    }
  }, [open, brand, reset]);

  const onSubmit = async (data: BrandFormValues) => {
    const toastId = toast.loading("Updating brand...");
    const formData = new FormData();

    formData.append("name", data.name);
    if (data.logo?.[0]) {
      formData.append("img", data.logo[0]);
    }

    try {
      await updateBrand({ id: brand._id, data: formData }).unwrap();

      toast.update(toastId, {
        render: "Brand updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        position: "top-center",
      });

      setOpen(false);
      reset();
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
        <Button size="sm" variant="ghost">
          <Pencil size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Brand</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div>
            <Label htmlFor="edit-brand-name">Name</Label>
            <Input id="edit-brand-name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label>Logo</Label>
            {currentImageUrl && (
              <div className="mb-3 flex items-center gap-3 rounded-md border p-2">
                <div className="relative size-14 overflow-hidden rounded bg-gray-100">
                  <Image
                    src={currentImageUrl}
                    alt={brand.name}
                    fill
                    sizes="56px"
                    className="object-contain"
                  />
                </div>
                <span className="text-sm text-gray-600">
                  Current logo. Upload a new file to replace it.
                </span>
              </div>
            )}
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

          <DialogFooter className="pt-4 flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
