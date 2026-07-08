"use client";

import { LogOut, Logs, ShoppingCart, User } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";


export function UserAvatar({
  className,
  userName,
  image,
}: {
  className: string;
  userName: string;
  image?: string;
}) {
  const router = useRouter();
  const { handleLogout, isLogoutLoading } = useAuth()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className={cn("cursor-pointer ", className)}>
          <AvatarImage src={image || "/img/user_placeholder.png"} alt={userName} />
          <AvatarFallback>{userName}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 text-center  bg-white/90 backdrop-blur-sm"
        align="end"
      >
        <div className=" pt-5 flex justify-center">
          <Avatar className={cn("cursor-pointer size-14 ")}>
            <AvatarImage src={image || ""} alt={userName} />
            <AvatarFallback>{userName}</AvatarFallback>
          </Avatar>
        </div>
        <h2 className=" mt-2 text-center text-sm">{userName}</h2>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => router.push("/profile")}
            className=" cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/cart")}
            className=" cursor-pointer"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            <span>Cart</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/order")}
            className=" cursor-pointer"
          >
            <Logs className="mr-2 h-4 w-4" />
            <span>My order</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className=" cursor-pointer"
            disabled={isLogoutLoading}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
