import React from "react";
import { ConfirmDialog } from "../../confirm-dialoge";
import { Button } from "../../button";
import { Trash2 } from "lucide-react";
import { useDeleteProductMutation } from "@/redux/features/product/productApi";
import { toast } from "react-toastify";

const DeleteProductAlert = ({ productId }: { productId: string }) => {
  const [DeletedProduct] = useDeleteProductMutation();

  const handleDelete = async () => {
    const toastId = toast.loading("Deleting Product...");
    try {
      const response = await DeletedProduct(productId).unwrap();
      toast.update(toastId, {
        render: response?.message || "Product deleted successfully",
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
      title="Delete this product?"
      description="This will permanently remove the product."
      actionText="Delete"
    >
      <Button variant="ghost">
        {" "}
        <Trash2 size={16} className="text-red-500 hover:text-red-700" />
      </Button>
    </ConfirmDialog>
  );
};

export default DeleteProductAlert;
