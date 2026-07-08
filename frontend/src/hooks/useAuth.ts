"use client";

import { useLogOutMeMutation } from "@/redux/features/auth/authApi";
import { logout as logoutAction } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const useAuth = () => {
  const [logOutMe, { isLoading: isLogoutLoading, isError: isLogoutError }] =
    useLogOutMeMutation();

  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");

    try {
      await logOutMe(null).unwrap();

      dispatch(logoutAction());

      const path = window.location.pathname;

      const privateRoutes = ["/order", "/profile", "/checkout"];

      const isPrivateRoute = privateRoutes.some((route) =>
        path.startsWith(route)
      );

      if (isPrivateRoute) {
        router.push("/login");
      }

      toast.update(toastId, {
        render: "Successfully logged out",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error: any) {
      toast.update(toastId, {
        render: error?.data?.message || "Something went wrong",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  return {
    handleLogout,
    isLogoutLoading,
    isLogoutError,
  };
};

export default useAuth;