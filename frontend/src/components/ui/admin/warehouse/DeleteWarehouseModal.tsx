'use client'
import React from "react";
import { ConfirmDialog } from "../../confirm-dialoge";
import { Button } from "../../button";
import { useDeleteWareHouseMutation } from "@/redux/features/warehouse/warehouseApi";
import { toast } from "react-toastify";

const DeleteWarehouseModal = ({ id }: { id: string }) => {
  const [deleteWarehouse] = useDeleteWareHouseMutation()

  // handle delete warehouse
  const handDeleteWarehouse = async () => {
    const toastId = toast.loading("Deleting warehouse...");
    try {
      const response = await deleteWarehouse(id).unwrap();
      toast.update(toastId, {
        render: response.data.message,
        type: "success",
        isLoading: false,
        autoClose: 3000,
        position: "top-center",
      });
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
  }

  return (
    <ConfirmDialog
      onConfirm={handDeleteWarehouse}
      title="Delete this Warehouse?"
      description="This will permanently remove the warehouse."
      actionText="Delete"
    >
      <Button variant="ghost" size={"sm"} className=" text-red-600 hover:underline">
        Delete
      </Button>
    </ConfirmDialog>
  );
};

export default DeleteWarehouseModal;
