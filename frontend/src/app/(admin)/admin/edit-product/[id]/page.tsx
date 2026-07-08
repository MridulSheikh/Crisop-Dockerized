"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams } from "next/navigation";

import ImgUpload from "@/components/shared/imgUpload/ImgUpload";
import TiptapEditor from "@/components/shared/TiptapEditor";
import { toast } from "react-toastify";
import {
  useUpdateProductMutation,
  useGetSingleProductQuery,
} from "@/redux/features/product/productApi";
import CategorySelect from "../../add-product/CategorySelect";
import StockSelect from "../../add-product/StockSelect";
import ProductTagInput from "../../add-product/ProductTagInput";
import Image from "next/image";
import { Undo } from "lucide-react";
import { LoadingUi } from "@/components/shared/loadingui/LoadingUi";
import BrandSelect from "../../add-product/BrandSelect";
import { useAppSelector } from "@/redux/hooks";
import { useCurrentUser } from "@/redux/features/auth/authSlice";
import { hasPermission } from "@/helper/auth";

const MAX_TOTAL_IMAGES = 5;

type FormValues = {
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  category: string;
  stock: string;
  brand: string;
  tags: string[];
  newImages: File[];
  isFeatured: boolean;
  isPublished: boolean;
};

type TKeepImage = {
  url: string;
  public_id: string;
};

const EditProductPage = () => {
  const { id } = useParams();
  const isDiscountTouched = useRef(false);
  const [keepImages, SetKeepImages] = useState<TKeepImage[]>([]);
  const [removeImages, SetRemoveImages] = useState<TKeepImage[]>([]);

  const { data, isLoading: isFetching } = useGetSingleProductQuery(
    id as string,
  );

  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  const {
    register,
    handleSubmit,
    control,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormValues>();

  const price = watch("price");
  const totalImages = keepImages?.length + (watch("newImages")?.length || 0);
  const user = useAppSelector(useCurrentUser);

  // 🟢 Prefill data
  useEffect(() => {
    if (data?.data) {
      const product = data.data;

      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        discountPrice: product.discountPrice,
        category: product.category?._id || product.category,
        stock: product.stock?._id || product.stock,
        brand: product.brand?._id || product.Brand,
        tags: product.tags,
        isFeatured: product.isFeatured,
        isPublished: product.isPublished,
      });
    }
    SetKeepImages(data?.data.images);
  }, [data, reset]);

  // Auto sync discount
  useEffect(() => {
    if (!isDiscountTouched.current) {
      setValue("discountPrice", price || 0);
    }
  }, [price, setValue]);

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", String(data.price));
    formData.append("discountPrice", String(data.discountPrice));
    formData.append("category", data.category);
    formData.append("brand", data.brand);
    formData.append("stock", data.stock);

    data.tags.forEach((tag) => {
      formData.append("tags", tag);
    });

    // optional image update
    if (data.newImages?.length > 0) {
      data.newImages.forEach((file) => {
        formData.append("newImages", file);
      });
    }

    if (removeImages?.length > 0) {
      removeImages.forEach((image) => {
        formData.append("removedImages", JSON.stringify(image));
      });
    }

    formData.append("isFeatured", String(data.isFeatured));
    formData.append("isPublished", String(data.isPublished));

    try {
      const result = await updateProduct({ id, body: formData }).unwrap();

      if (result.success) {
        toast.success(result.message);
        SetRemoveImages([]);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.errorMessage || "Update failed ❌");
    }
  };

  const onRemoveImagehandle = (image: TKeepImage) => {
    // remove from keepImages
    SetKeepImages((prev) =>
      prev.filter((img) => img.public_id !== image.public_id),
    );

    // add to removeImages
    SetRemoveImages((prev) => {
      const exists = prev.find((img) => img.public_id === image.public_id);

      if (exists) return prev;

      return [...prev, image];
    });
  };

  const onUndoImageHandle = (image: TKeepImage) => {
    // remove from keepImages
    SetRemoveImages((prev) =>
      prev.filter((img) => img.public_id !== image.public_id),
    );

    // add to removeImages
    SetKeepImages((prev) => {
      const exists = prev.find((img) => img.public_id === image.public_id);

      if (exists) return prev;

      return [...prev, image];
    });
  };

  if (
    !hasPermission(
      user?.role as "admin" | "manager" | "super",
      "update:products",
    )
  ) {
    return null;
  }

  if (isFetching)
    return (
      <div className=" w-full h-screen flex justify-center items-center">
        <LoadingUi />
      </div>
    );

  return (
    <div className="p-6 max-w-4xl xl:max-w-full mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Edit Product</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 grid xl:grid-cols-6 gap-x-10"
      >
        {/* LEFT */}
        <div className="flex flex-col xl:col-span-4 gap-y-5">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              {...register("name")}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TiptapEditor value={field.value} onChange={field.onChange} />
              )}
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col xl:col-span-2 gap-y-5">
          <div>
            <label className="block mb-1 font-medium">Price</label>
            <input
              type="number"
              {...register("price")}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Discount price</label>
            <input
              type="number"
              {...register("discountPrice")}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <Controller
              name="category"
              control={control}
              render={({ field }) => <CategorySelect {...field} />}
            />
          </div>

          <Controller
            name="stock"
            control={control}
            render={({ field }) => <StockSelect {...field} />}
          />

          <Controller
            name="brand"
            control={control}
            render={({ field }) => <BrandSelect {...field} />}
          />
          <div>
            <label className="block mb-1 font-medium">Tags</label>
            <Controller
              name="tags"
              control={control}
              render={({ field }) => <ProductTagInput {...field} />}
            />
          </div>

          {/* Keep images */}

          {keepImages?.length != 0 && (
            <div>
              <label className="block mb-1 font-medium">Keep images</label>
              <div className="flex gap-5 flex-wrap">
                {keepImages?.map((image: TKeepImage) => (
                  <div
                    key={image.public_id}
                    className="relative w-32 h-32 overflow-hidden rounded group"
                  >
                    <Image
                      src={image.url}
                      alt=""
                      fill
                      className="object-cover"
                    />

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => onRemoveImagehandle(image)}
                      className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Remove images */}
          {removeImages?.length != 0 && (
            <div>
              <label className="block mb-1 font-medium">Remove images</label>
              <div className="flex gap-5 flex-wrap">
                {removeImages?.map((image: TKeepImage) => (
                  <div
                    key={image.public_id}
                    className="relative w-32 h-32 overflow-hidden rounded group"
                  >
                    <Image
                      src={image.url}
                      alt=""
                      fill
                      className="object-cover"
                    />

                    <button
                      onClick={() => onUndoImageHandle(image)}
                      type="button"
                      disabled={totalImages >= MAX_TOTAL_IMAGES}
                      className={`absolute top-2 right-2 text-xs px-2 py-1 rounded transition ${
                        totalImages >= MAX_TOTAL_IMAGES
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      <Undo />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Images (optional update) */}
          <div>
            <label className="block mb-1 font-medium">New images</label>
            <Controller
              name="newImages"
              control={control}
              render={({ field }) => (
                <ImgUpload
                  value={field.value}
                  onChange={field.onChange}
                  max_file={Math.max(MAX_TOTAL_IMAGES - keepImages?.length, 0)}
                />
              )}
            />
          </div>

          {/* Checkboxes */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("isFeatured")} />
              Featured Product
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("isPublished")} />
              Publish Product
            </label>
          </div>

          <button className="bg-black text-white py-2 rounded">
            {isLoading ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductPage;
