"use client";

import Link from "next/link";
import React, { FC, useState } from "react";
import { Button } from "../../button";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdClose } from "react-icons/md";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { motion } from "framer-motion";
import { useAppSelector } from "@/redux/hooks";
import { useCurrentUser } from "@/redux/features/auth/authSlice";

const navigationData = [
  {
    name: "Recycle",
    link: "/",
  },
  {
    name: "Shop",
    link: "/shop",
  },
];

const AdminNavBar: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const user = useAppSelector(useCurrentUser);
  return (
    <div
      className={cn(" py-3 z-50 w-full bg-gray-950 text-white shadow-md")}
    >
      <div className=" mx-auto px-5 flex justify-between items-center">
        <h1 className="text-white font-semibold text-xl">Admin Panel</h1>
        <div className=" flex gap-x-7 items-center">
           <ul className="  hidden lg:flex justify-center  items-center gap-x-7 h-full list-none">
          {navigationData.map((dt, i) => (
            <li key={i} className=" relative">
              <Link
                href={dt.link}
                className={cn(
                  " ease-in-out duration-300 font-semibold hover:text-[#F76364] after:content-[''] after:bg-[#F76364] after:h-[3px] after:w-[0%] after:left-0 after:-bottom-[5px] after:rounded-xl after:absolute after:duration-300",
                  
                )}
              >
                {dt.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className=" flex gap-x-4 items-center">
          {user ? (
            <UserAvatar className="hidden lg:inline-block mx-auto size-10 " userName={user.name} />
          ) : (
            <Link href={"/login"}>
              <Button className=" hidden lg:inline-block rounded-full">
                {" "}
                Login{" "}
              </Button>
            </Link>
          )}

          <Button
            onClick={() => setIsOpen((prev) => !prev)}
            variant={"ghost"}
            className=" lg:hidden"
          >
            {isOpen ? (
              <MdClose className=" text-3xl" />
            ) : (
              <HiMenuAlt3 className=" text-3xl" />
            )}
          </Button>
        </div>
        </div>
       
      </div>
      <motion.div
        variants={{
          visible: { x: 0, opacity: "100%" },
          hidden: { x: "1000%", display: "none" },
        }}
        initial={{ x: "1000%" }}
        animate={!isOpen ? "hidden" : "visible"}
        transition={{
          duration: 0.35,
          ease: "easeInOut",
          opacity: {
            duration: 0.8,
          },
        }}
        className="mt-5 lg:hidden overflow-hidden"
      >
        <ul className="text-lg pb-5 text-center">
          {navigationData.map((dt, i) => (
            <li
              key={i}
              className=" hover:text-[#F76364] ease-in-out duration-300 hover:font-bold font-semibold px-5 py-4 bg-[#EFEEEE]"
            >
              <Link href={dt.link}>{dt.name}</Link>
            </li>
          ))}
        </ul>
        <div className=" px-5 text-center">
          {user ? (
            <div className="">
              <UserAvatar className="mx-auto size-14 mb-5" userName={user.name} />
            </div>
          ) : (
            <Button className="w-full"> Login </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminNavBar;
