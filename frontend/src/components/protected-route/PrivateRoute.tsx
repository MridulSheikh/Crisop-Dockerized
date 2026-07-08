"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import LoadingScreen from "../shared/loadingui/LoadingScreen";
import { hasPermission } from "@/helper/auth";
import { toast } from "react-toastify";

const allowedRoles = ["admin", "manager", "super"];

export default function PrivateRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const token = useAppSelector((state) => state.auth.token);
  const role = useAppSelector((state) => state.auth.user?.role);

  const isAdminRoute = pathname.startsWith("/admin");
  const isProductDetailsRoute = pathname.includes("/admin/edit-product");
  const isAddProductRoute = pathname.includes("/admin/add-product");
  const isManageTeamPage = pathname.includes('/admin/team');
  const isOrderPage = pathname.includes('/admin/order')
  const isAllowedAdmin = !!role && allowedRoles.includes(role);
  console.log(pathname.includes("/admin/add-product"));

  useEffect(() => {
    if (!token) {
      router.replace(`/login?redirect=${pathname}`);
      return;
    }

    if (isAdminRoute && !isAllowedAdmin) {
      router.replace("/");
      return;
    }

    if (
      (isProductDetailsRoute || isAddProductRoute || isManageTeamPage || isOrderPage) &&
      !hasPermission(role as "admin" | "manager" | "super", "manage:products")
    ) {
      router.back();
      return;
    }
  }, [token, pathname, isAdminRoute, isAllowedAdmin, router]);

  if (!token || (isAdminRoute && !isAllowedAdmin)) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
