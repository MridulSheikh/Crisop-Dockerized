"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { toggleChatbot } from "@/redux/features/bot/chatbotSlice";

export default function HeroButtons() {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center md:justify-start pt-2 w-full sm:w-auto">
      
      {/* primary shop button */}
      <Link href="/shop" className="w-full sm:w-auto">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full sm:w-auto"
        >
          <Button className="group relative w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 bg-gradient-to-r from-[#106D42] via-emerald-600 to-teal-600 hover:from-[#0d5936] hover:to-teal-700 text-white font-medium text-base rounded-2xl shadow-lg shadow-emerald-900/20 hover:shadow-emerald-600/30 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden border border-emerald-400/30">
            
            {/* light effects */}
            <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out" />

            <ShoppingBag className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110" />

            <span>Explore AI Shop</span>

            <ArrowRight className="w-4 h-4 opacity-70 transition-transform duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
          </Button>
        </motion.div>
      </Link>

      {/* chatbot button */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full sm:w-auto"
      >
        <Button
          onClick={() => dispatch(toggleChatbot())}
          variant="outline"
          className="group relative w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 bg-white/80 backdrop-blur-md hover:bg-emerald-50/80 text-gray-800 hover:text-[#106D42] border border-gray-200/80 hover:border-emerald-500/40 font-medium text-base rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
        >
          {/* Subtle Glow Dot */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>

          <span>Talk to AI Assistant</span>

          <Sparkles className="w-4 h-4 text-emerald-600 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
        </Button>
      </motion.div>

    </div>
  );
}