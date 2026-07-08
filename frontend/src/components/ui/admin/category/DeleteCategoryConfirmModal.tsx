"use client";

import React from "react";
import { ConfirmDialog } from "../../confirm-dialoge";
import { Button } from "../../button";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useDeleteCategoryMutation } from "@/redux/features/category/categoryApi";

interface DeleteCategoryAlertProps {
  categoryId: string;
}

const DeleteCategoryAlert: React.FC<DeleteCategoryAlertProps> = ({ categoryId }) => {
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleDelete = async () => {
    const toastId = toast.loading("Deleting category...");

    try {
      const response = await deleteCategory(categoryId).unwrap();

      toast.update(toastId, {
        render: response?.message || "Category deleted successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        position: "top-center",
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.update(toastId, {
        render: error?.data?.message || "Failed to delete category!",
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
      title="Delete this Category?"
      description="This will permanently remove the category."
      actionText="Delete"
    >
      <Button variant="ghost">
        <Trash2 size={16} className="text-red-500 hover:text-red-700" />
      </Button>
    </ConfirmDialog>
  );
};

export default DeleteCategoryAlert;