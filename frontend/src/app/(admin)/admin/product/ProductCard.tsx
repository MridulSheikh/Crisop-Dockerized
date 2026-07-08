import DeleteProductAlert from "@/components/ui/admin/products/DeleteProductAlert";
import UpdateStock from "@/components/ui/admin/stock/UpdateStockModal";
import { Button } from "@/components/ui/button";
import { hasPermission } from "@/helper/auth";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { TProduct } from "@/types/user";
import { Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProductCard = ({ product }: { product: TProduct }) => {
  const user = useAppSelector(useCurrentUser);
  return (
    <tr className="hover:bg-gray-50 transition duration-150 border-b">
      <td className="p-3">
        <Image
          src={product.images[0].url}
          alt={product.name}
          width={40}
          height={40}
          className="rounded object-cover"
        />
      </td>
      <td className="p-3 font-medium text-gray-800">{product.name}</td>
      <td
        className={cn("p-3 font-medium text-gray-800", {
          "bg-red-300 text-red-900": !product?.category,
        })}
      >
        {product?.category ? product?.category?.name : "Category not found"}
      </td>
      <td className="p-3 text-gray-600">${product.price.toFixed(2)}</td>
      <td className="p-3 text-gray-600">{product.stock.quantity}</td>
      <td className="p-3">
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            product.isPublished === true
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {product.isPublished === true ? "Published" : "Pending"}
        </span>
      </td>
      <td className="p-3 text-right space-x-2">
        {hasPermission(
          user?.role as "admin" | "manager" | "super",
          "manage:products",
        ) && (
          <>
            <Link href={`/admin/edit-product/${product._id}`}>
              <Button size="sm" variant="ghost">
                <Pencil size={16} />
              </Button>
            </Link>
            <DeleteProductAlert productId={product?._id} />
          </>
        )}
        {!hasPermission(
          user?.role as "admin" | "manager" | "super",
          "manage:products",
        ) &&
          hasPermission(
            user?.role as "admin" | "manager" | "super",
            "update:stocks",
          ) && (
            <>
              <UpdateStock stock={product.stock} />
            </>
          )}
      </td>
    </tr>
  );
};

export default ProductCard;
