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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";

// Permissions grouped by section
const PERMISSIONS_BY_SECTION = {
  Product: {
    canAddProduct: "Add Product",
    canDeleteProduct: "Delete Product",
    canUpdateProduct: "Update Product",
    canSeeProduct: "See Product",
  },
  Category: {
    canAddCategory: "Add Category",
    canDeleteCategory: "Delete Category",
    canUpdateCategory: "Update Category",
    canSeeCategory: "See Category",
  },
  Stock: {
    canAddStock: "Add Stock",
    canDeleteStock: "Delete Stock",
    canUpdateStock: "Update Stock",
    canSeeStock: "See Stock",
  },
  Warehouse: {
    canAddWarehouse: "Add Warehouse",
    canDeleteWarehouse: "Delete Warehouse",
    canUpdateWarehouse: "Update Warehouse",
    canSeeWarehouse: "See Warehouse",
  },
  Role: {
    canAddRole: "Add Role",
    canDeleteRole: "Delete Role",
    canUpdateRole: "Update Role",
    canSeeRole: "See Role",
  },
  Member: {
    canAddMember: "Add Member",
    canDeleteMember: "Delete Member",
    canUpdateMember: "Update Member",
    canSeeMember: "See Member",
  },
  Customer: {
    canAddCustomer: "Add Customer",
    canDeleteCustomer: "Delete Customer",
    canUpdateCustomer: "Update Customer",
    canSeeCustomer: "See Customer",
  },
  Coupon: {
    canAddCoupon: "Add Coupon",
    canDeleteCoupon: "Delete Coupon",
    canUpdateCoupon: "Update Coupon",
    canSeeCoupon: "See Coupon",
  },
  Order: {
    canAddOrder: "Add Order",
    canDeleteOrder: "Delete Order",
    canUpdateOrder: "Update Order",
    canSeeOrder: "See Order",
  },
};

// Flatten all permission keys for zod schema
const allPermissionKeys = Object.values(PERMISSIONS_BY_SECTION).flatMap((section) =>
  Object.keys(section)
);

const roleSchema = z.object({
  roleName: z.string().min(1, "Role name is required"),
  description: z.string().optional(),
  permissions: z.object(
    Object.fromEntries(
      allPermissionKeys.map((key) => [key, z.boolean()])
    )
  ),
});

type RoleFormValues = z.infer<typeof roleSchema>;

type AddRoleModalProps = {
  onAdd: (role: RoleFormValues) => void;
};

export default function AddRoleModal({ onAdd }: AddRoleModalProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      roleName: "",
      description: "",
      permissions: Object.fromEntries(
        allPermissionKeys.map((key) => [key, false])
      ) as Record<string, boolean>,
    },
  });

  const onSubmit = (data: RoleFormValues) => {
    onAdd(data);
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>
          + Add Role
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Role</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div>
            <Label htmlFor="roleName">Role Name</Label>
            <Input id="roleName" {...register("roleName")} placeholder="e.g., Manager" />
            {errors.roleName && (
              <p className="text-sm text-red-500 mt-1">{errors.roleName.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} placeholder="Role description" />
          </div>

          <div>
            <Label>Permissions</Label>
            {Object.entries(PERMISSIONS_BY_SECTION).map(([sectionName, perms]) => (
              <section key={sectionName} className="mb-4">
                <h3 className="font-semibold mb-2">{sectionName}</h3>
                <div className="grid grid-cols-2 gap-2 border rounded p-2 max-h-40 overflow-y-auto">
                  {Object.entries(perms).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={watch(`permissions.${key}`) || false}
                        onCheckedChange={(checked) =>
                          setValue(`permissions.${key}`, Boolean(checked))
                        }
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <DialogFooter className="pt-4">
            <Button type="submit">Add Role</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
