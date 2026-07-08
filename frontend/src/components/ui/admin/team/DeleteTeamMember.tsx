import React from "react";
import { ConfirmDialog } from "../../confirm-dialoge";
import { Button } from "../../button";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useChangeUserRoleMutation } from "@/redux/features/user/userApi";

interface propsTypes {
  email : string
}

const DeleteTeamMember = (props : propsTypes) => {
  const {email} = props;
    const [changeRole, { isLoading }] =
      useChangeUserRoleMutation()
  // handle delete function
  const handleDeleteTeamMember = async() =>{
      const toastId = toast.loading("Removing...");
          try {
            await changeRole({
              email: email,
              role: "user",
            }).unwrap();
            toast.update(toastId, {
              render: "Successfully removed team member",
              type: "success",
              isLoading: false,
              autoClose: 3000,
              position: "top-center",
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (err: any) {
            toast.update(toastId, {
              render:
                err?.data?.errorMessage ??
                "something went wrong",
              type: "error",
              isLoading: false,
              autoClose: 4000,
              position: "top-center",
            });
          }
  }
  return (
    <ConfirmDialog
      onConfirm={handleDeleteTeamMember}
      title="Delete this Member?"
      description="This will permanently deleted the member."
      actionText="Delete"
    >
      <Button disabled={isLoading} variant="outline" className=" outline-red-500 text-red-500">
        {" "}
        <Trash2 size={16}  /> Delete
      </Button>
    </ConfirmDialog>
  );
};

export default DeleteTeamMember;
