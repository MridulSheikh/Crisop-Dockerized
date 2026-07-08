"use client";
import { useRouter } from "next/navigation";
import React from "react";

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <div className=" max-w-screen-xl h-screen mx-auto px-5 flex items-center justify-center">
      <div>
        <h1 className=" text-4xl font-bold">Congratulations!</h1>
        <p className=" mt-2">
          You climbed to the top of our site! Please enjoy the landscape, and
          then{" "}
          <span
            className=" underline cursor-pointer"
            onClick={() => router.back()}
          >
            return back
          </span>
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
