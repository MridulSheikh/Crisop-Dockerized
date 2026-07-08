import { Button } from "@/components/ui/button";
import { Construction } from "lucide-react";
import Image from "next/image";
import React from "react";

const ConstructionPageUi = ({discription}: {discription: string}) => {
  return (
    <div className="h-[80vh] flex flex-col items-center justify-center text-center px-5">
      {/* 🛠️ Illustration */}
      <div className="relative w-64 h-64 mb-6">
        <Image
          src="/img/page_under_contruction.png"
          alt="Under Construction"
          fill
          className="object-contain"
        />
      </div>

      {/* Text */}
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Construction className="text-orange-500" />
        Page Under Construction
      </h1>

      <p className="text-gray-500 mt-2 max-w-md">
        {discription}
      </p>

      <Button className="mt-6" onClick={() => window.history.back()}>
        Go Back
      </Button>
    </div>
  );
};

export default ConstructionPageUi;
