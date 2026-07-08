import Image from "next/image";
import React from "react";

const Categories = () => {
  return (
    <div className=" max-w-screen-xl mx-auto px-5">
      <div className=" text-center pt-[70px]">
        <h1 className=" text-[36px] font-bold text-[#2F2F2E]">
          All Categories
        </h1>
        <p className=" mt-[12px] md:w-3/6 mx-auto text-[#666666]">
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
          nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam.
        </p>
      </div>
      <div className="mt-[50px] grid grid-cols-1 lg:grid-cols-3 gap-y-5 lg:gap-y-0 gap-x-5">
        <div className=" relative cursor-pointer h-40 lg:h-[513px] rounded-xl overflow-hidden">
          <Image
            src={"/img/vagitable_category.png"}
            alt="vagitable_category"
            fill
            className=" object-cover object-center"
          />
          <div className="w-full h-full absolute top-0 left-0 bg-black bg-opacity-50" />
          <h1 className="text-[22px] absolute bottom-5 left-5 text-white">
            Vegetables
          </h1>
        </div>
        <div className=" grid grid-cols-1 gap-y-5">
          <div className=" relative h-40 lg:h-auto cursor-pointer rounded-xl overflow-hidden">
            <Image
              src={"/img/meat_category.png"}
              alt="meat_category"
              fill
              className=" object-cover object-center"
            />
            <div className="w-full h-full absolute top-0 left-0 bg-black bg-opacity-50" />
            <h1 className="text-[22px] absolute bottom-5 left-5 text-white">
              Meat
            </h1>
          </div>
          <div className=" relative h-40 lg:h-auto cursor-pointer rounded-xl overflow-hidden">
            <Image
              src={"/img/fruits_category.png"}
              alt="fruits_category"
              fill
              className=" object-cover object-center"
            />
            <div className="w-full h-full absolute top-0 left-0 bg-black bg-opacity-50" />
            <h1 className="text-[22px] absolute bottom-5 left-5 text-white">
              Fruits
            </h1>
          </div>
        </div>

        <div className=" relative cursor-pointer  h-40 lg:h-[513px] rounded-xl overflow-hidden">
          <Image
            src={"/img/fish_category.png"}
            alt="fish_category"
            fill
            className=" object-cover object-center"
          />
          <div className="w-full h-full absolute top-0 left-0 bg-black bg-opacity-50" />
          <h1 className="text-[22px] absolute bottom-5 left-5 text-white">
            Fish
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Categories;
