"use client";

import React from "react";
import { ConfirmDialog } from "../../confirm-dialoge";
import { Button } from "../../button";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useDeleteStocksMutation } from "@/redux/features/warehouse/stockApi";

type DeleteStockModalProps = {
  stockId: string; 
};

const DeleteStockModal: React.FC<DeleteStockModalProps> = ({ stockId }) => {
  const [deleteStock] = useDeleteStocksMutation();

  const handleDelete = async () => {
    const toastId = toast.loading("Deleting stock...");
    try {
      const response = await deleteStock(stockId).unwrap();
      toast.update(toastId, {
        render: response?.message || "Stock deleted successfully",
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
          "Something went wrong!",
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
      title="Delete this stock?"
      description="This will permanently remove the stock."
      actionText="Delete"
    >
      <Button variant="ghost">
        <Trash2 size={16} className="text-red-500 hover:text-red-700" />
      </Button>
    </ConfirmDialog>
  );
};

export default DeleteStockModal;