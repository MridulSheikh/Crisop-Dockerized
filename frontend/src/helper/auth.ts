const ROLES = {
  super: ["add:team-member", "delete:team-member", "roaling:team-member"],
  admin: [
    "manage:products",
    "view:products",
    "create:products",
    "update:products",
    "delete:products",
    "view:categories",
    "update:categories",
    "create:categories",
    "delete:categories",
    "create:brands",
    "update:brands",
    "view:brands",
    "delete:brands",
    "view:orders",
    "create:orders",
    "update:orders",
    "delete:orders",
    "view:stocks",
    "update:stocks",
    "create:stocks",
    "delete:stocks",
    "create:warehouses",
    "view:warehouses",
    "update:warehouses",
    "delete:warehouses",
    "view:teams",
  ],
  manager: [
    "view:products",
    "view:stocks",
    "update:stocks",
    "create:stocks",
    "delete:stocks",
    "view:warehouses",
    "update:warehouses",
    "create:warehouses",
    "delete:warehouses",
  ],
} as const;

export type Role = keyof typeof ROLES;
export type Permission = (typeof ROLES)[Role][number];

export function hasPermission(
  role: Role | "super",
  permission: Permission,
): boolean {
  if (role === "super") {
    return true;
  }

  const currentRolePermissions = ROLES[role as Role] as readonly string[];

  return currentRolePermissions.includes(permission);
}
