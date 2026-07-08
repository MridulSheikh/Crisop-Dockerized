"use client";

import React from "react";
import { ConfirmDialog } from "../../confirm-dialoge";
import { Button } from "../../button";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useSoftDeleteBrandMutation } from "@/redux/features/brand/brandApi";

interface DeleteBrandAlertProps {
  brandId: string;
}

const DeleteBrandAlert: React.FC<DeleteBrandAlertProps> = ({ brandId }) => {
  const [deleteBrand] = useSoftDeleteBrandMutation();

  const handleDelete = async () => {
    const toastId = toast.loading("Deleting brand...");

    try {
      await deleteBrand(brandId).unwrap();

      toast.update(toastId, {
        render: "Brand deleted successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        position: "top-center",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.update(toastId, {
        render:
          error?.data?.errorMessage ||
          error?.data?.message ||
          "Failed to delete brand!",
        type: "error",
        isLoading: false,
        autoClose: 4000,
        position: "top-center",
      });
    }
  };

  return (
    <ConfirmDialog
      onConfirm={handleDelete}
      title="Delete this Brand?"
      description="This will remove the brand from active lists."
      actionText="Delete"
    >
      <Button variant="ghost">
        <Trash2 size={16} className="text-red-500 hover:text-red-700" />
      </Button>
    </ConfirmDialog>
  );
};

export default DeleteBrandAlert;
