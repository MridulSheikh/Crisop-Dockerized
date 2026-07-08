"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { toggleChatbot } from "@/redux/features/bot/chatbotSlice";

export default function HeroButtons() {
    const dispatch = useDispatch();
  return (
    <div className="flex flex-col lg:flex-row items-center gap-4 justify-center md:justify-start pt-2">
      
      {/* Primary Button */}
      <Link href="/shop">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <Button className="bg-gradient-to-r from-[#106D42] to-emerald-500 hover:from-[#0c5132] hover:to-emerald-600 text-white py-3 w-full lg:w-auto lg:px-6 lg:py-6 text-base rounded-xl shadow-md hover:shadow-xl transition-all flex items-center gap-2 overflow-hidden relative">
            
            {/* icon animation */}
            <motion.span
              initial={{ x: -5, opacity: 0.8 }}
              whileHover={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <ShoppingBag className="w-5 h-5" />
            </motion.span>

            Explore AI Shop
          </Button>
        </motion.div>
      </Link>

      {/* AI Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
      >
        <Button
         onClick={() => dispatch(toggleChatbot())}
          variant="outline"
          className="py-3 w-full lg:w-auto lg:px-6 lg:py-6 text-base rounded-xl border-2 hover:bg-gray-900 hover:text-white transition-all flex items-center gap-2 overflow-hidden relative"
        >
          
          {/* Bot icon animation */}
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              ease: "easeInOut",
            }}
          >
            <Bot className="w-5 h-5" />
          </motion.span>

          Talk to AI Assistant
        </Button>
      </motion.div>

    </div>
  );
}