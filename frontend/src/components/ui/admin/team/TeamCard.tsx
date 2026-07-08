import { TUser } from "@/types/user";
import React from "react";
import DeleteTeamMember from "./DeleteTeamMember";
import { useChangeUserRoleMutation } from "@/redux/features/user/userApi";
import { toast } from "react-toastify";
import { useAppSelector } from "@/redux/hooks";
import { useCurrentUser } from "@/redux/features/auth/authSlice";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from "../../select";
import { SelectValue } from "@radix-ui/react-select";
import { Avatar, AvatarImage } from "../../avatar";
import { cn } from "@/lib/utils";
import { hasPermission } from "@/helper/auth";

interface IProps {
  member: TUser;
}



const TeamCard = (props: IProps) => {
  const { member } = props;
  const user = useAppSelector(useCurrentUser);
  const [changeRole] = useChangeUserRoleMutation()
  const isSameAdmin = user?.role === "admin" && member.role === "admin";
  const isSuper = member?.role === "super";
  return (
    <tr className="hover:bg-gray-50 transition duration-150 border-b">
      <td className="p-3 font-medium text-gray-800 flex gap-x-3 items-center">
          <Avatar className={cn("cursor-pointer size-7 ")}>
            <AvatarImage src={member.image} alt="@shadcn" />
          </Avatar>
        {member.name}</td>
      <td className="p-3 text-gray-600">{member.email}</td>

      {/* Role column with dropdown */}
      <td className="p-3 text-gray-600 capitalize">
        <Select
          disabled={isSameAdmin || !hasPermission(user?.role as "admin" | "manager" | "super", "delete:team-member")}
          defaultValue={member.role}
          onValueChange={async (newRole) => {
            const toastId = toast.loading("Updating...");
            try {
              await changeRole({
                email: member.email,
                role: newRole,
              }).unwrap();
              toast.update(toastId, {
                render: "Successfully role changed",
                type: "success",
                isLoading: false,
                autoClose: 3000,
                position: "top-center",
              });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
              toast.update(toastId, {
                render: err?.data?.errorMessage ?? "Something went wrong",
                type: "error",
                isLoading: false,
                autoClose: 4000,
                position: "top-center",
              });
            }
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Roles</SelectLabel>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </td>

      <td className="p-3 text-right space-x-3 flex items-center justify-end">
        {/* Delete Button */}
        {
          hasPermission(user?.role as "admin" | "manager" | "super", "delete:team-member") ? (
            <DeleteTeamMember email={member.email} />  
          ): <span className="text-yellow-500">Permission required!</span>
        }
      </td>
    </tr>
  );
};

export default TeamCard;
