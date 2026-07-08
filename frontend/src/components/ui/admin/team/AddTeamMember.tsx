"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus } from "lucide-react";

// Schema with role added
const memberSchema = z.object({
  email: z.string().email("Enter a valid email"),
  roleId: z.string().min(1, "Select a role"),
});

type MemberFormValues = z.infer<typeof memberSchema>;

type AddTeamMemberModalProps = {
  onAdd: (member: MemberFormValues) => void;
  roles: string[];
  isLoading: boolean;
};

export default function AddTeamMemberModal({
  onAdd,
  roles,
  isLoading,
}: AddTeamMemberModalProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      email: "",
      roleId: "",
    },
  });

  const onSubmit = (data: MemberFormValues) => {
    onAdd(data);
    reset();
    setOpen(false);
  };

  // Watch roleId to show in SelectValue
  const selectedRole = watch("roleId");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-black text-white px-4 py-2 rounded-md hover:opacity-90">
        <UserPlus /> Add team member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className=" flex justify-center h-full items-center">
            <h1>Loading...</h1>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <Select
                value={selectedRole}
                onValueChange={(val) => setValue("roleId", val)}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role, index) => (
                    <SelectItem key={index} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.roleId && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.roleId.message}
                </p>
              )}
            </div>

            <DialogFooter className="pt-4">
              <Button type="submit">Add</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
