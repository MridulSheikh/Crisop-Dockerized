import React from "react";
import { ConfirmDialog } from "../../confirm-dialoge";
import { Button } from "../../button";
import { Trash2 } from "lucide-react";

const DeleteRollModal = () => {
  return (
    <ConfirmDialog
      onConfirm={() => console.log("Delete confirmed")}
      title="Delete this Roll?"
      description="This will permanently remove the roll."
      actionText="Delete"
    >
      <Button variant="outline" className="text-red-500 hover:text-red-700">
        {" "}
        <Trash2 size={16}  /> Delete
      </Button>
    </ConfirmDialog>
  );
};

export default DeleteRollModal;
