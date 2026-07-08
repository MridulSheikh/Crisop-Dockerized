import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../sheet";
import { Label } from "@/components/ui/label";
import { Button } from "../button";
import { VscSettings } from "react-icons/vsc";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../accordion";
import { Checkbox } from "../checkbox";
import { RadioGroup, RadioGroupItem } from "../radio-group";

const ProductFillter = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"outline"} className=" border-black rounded-full">
          <VscSettings className=" text-xl mr-2" /> All Filters
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetHeader>
          <SheetTitle>All Fillters</SheetTitle>
        </SheetHeader>
        <Accordion
          defaultValue="item-1"
          type="single"
          collapsible
          className="w-full mt-5"
        >
          {/* start categories */}
          <AccordionItem value="item-1">
            <AccordionTrigger>Categories</AccordionTrigger>
            <AccordionContent className="mt-5">
              <div className="flex flex-col gap-y-6">
                <div className=" flex items-center gap-x-2">
                  <Checkbox id="fruites" />
                  <label
                    htmlFor="fruites"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Fruites
                  </label>
                </div>
                <div className=" flex items-center gap-x-2">
                  <Checkbox id="vagitables" />
                  <label
                    htmlFor="vagitables"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Vagitables
                  </label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          {/* end categories */}
          <AccordionItem value="item-2">
            <AccordionTrigger>Price</AccordionTrigger>
            <AccordionContent className="mt-5">
              <RadioGroup className=" flex flex-col gap-y-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="150" id="maxPrice_150" />
                  <Label htmlFor="maxPrice_150">Under $150</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="200" id="maxPrice_200" />
                  <Label htmlFor="maxPrice_200">Under $200</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="300" id="maxPrice_300" />
                  <Label htmlFor="maxPrice_300">Under $300</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="400" id="maxPrice_400" />
                  <Label htmlFor="maxPrice_300">Under $300</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom">Custom ($0 to $0)</Label>
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
          {/* <AccordionItem value="item-3">
            <AccordionTrigger>Spacial Offers</AccordionTrigger>
            <AccordionContent>
              Yes. It&apos;s animated by default, but you can disable it if you
              prefer.
            </AccordionContent>
          </AccordionItem> */}
        </Accordion>
      </SheetContent>
    </Sheet>
  );
};

export default ProductFillter;
