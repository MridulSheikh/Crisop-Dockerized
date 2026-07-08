"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import CategorySidebar from "@/components/ui/products/SelectCategorySidebar";
import { motion, AnimatePresence } from "framer-motion";
import PriceFilter from "./PriceFilter";
import BrandFilter from "./BrandFilter";

export default function MobileFilter() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} variant={"outline"}>
        <Menu />
        Filter
      </Button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50">
            {/* Overlay */}
            <motion.div
              className="absolute inset-0 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              className="absolute top-0 left-0 w-64 h-full bg-white shadow-lg"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <CategorySidebar className="border-0" />
              <PriceFilter className=" shadow-none mt-0" />
              <BrandFilter className="shadow-none" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}