"use client";

import { useInView, motion } from "framer-motion";
import { CircleHelp, Package, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

/* =========================
   DATA
========================= */
const features = [
  {
    icon: ShieldCheck,
    title: "Premium Quality",
    desc: "Fresh and verified groceries sourced from trusted suppliers and local farms.",
  },
  {
    icon: CircleHelp,
    title: "24/7 Smart Support",
    desc: "Dedicated support team and AI assistance available anytime you need help.",
  },
  {
    icon: Package,
    title: "Fast Delivery",
    desc: "Reliable same-day delivery system designed for speed and convenience.",
  },
];

/* =========================
   ANIMATION VARIANTS
========================= */

const containerVariant = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 50,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const cardVariant = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.96,
  },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.12,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const imageVariant = {
  hidden: {
    opacity: 0,
    scale: 1.08,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* =========================
   COMPONENT
========================= */

const AboutUs = () => {
  const ref = useRef(null);

  const inView = useInView(ref, {
    once: true,
    amount: 0.2,
  });

  return (
    <section
      id="about-us"
      className="relative overflow-hidden py-20 md:py-32 px-5"
    >

      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-emerald-300/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-green-300/10 rounded-full blur-[120px]" />

      <div className="max-w-screen-2xl mx-auto relative z-10">

        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">

          {/* ================= LEFT ================= */}
          <motion.div
            ref={ref}
            variants={containerVariant}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="space-y-10"
          >

            {/* Badge */}
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-sm font-medium text-emerald-700"
            >
              About Crisop
            </motion.div>

            {/* Heading */}
            <motion.div variants={fadeUp} className="space-y-6">

              <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-gray-900 leading-tight">
                Redefining grocery delivery with modern technology
              </h1>

              <p className="text-gray-500 text-lg leading-relaxed max-w-xl">
                Crisop combines intelligent logistics, premium quality products,
                and modern delivery systems to create a faster, smarter, and
                more reliable grocery shopping experience.
              </p>

            </motion.div>

            {/* Features */}
            <div className="space-y-5">

              {features.map((item, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={cardVariant}
                  whileHover={{
                    y: -5,
                    transition: { duration: 0.25 },
                  }}
                  className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-xl p-5 shadow-sm hover:shadow-xl transition-all duration-500"
                >

                  {/* hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

                  <div className="relative flex gap-4">

                    {/* Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                      <item.icon size={22} />
                    </div>

                    {/* Text */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.title}
                      </h3>

                      <p className="text-gray-500 text-sm leading-relaxed mt-1">
                        {item.desc}
                      </p>
                    </div>

                  </div>

                </motion.div>
              ))}

            </div>

          </motion.div>

          {/* ================= RIGHT IMAGE ================= */}
          <motion.div
            variants={imageVariant}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="relative"
          >

            {/* glow */}
            <div className="absolute inset-0 bg-emerald-200/20 blur-3xl rounded-full scale-75" />

            {/* image shell */}
            <div className="relative overflow-hidden rounded-[32px] border border-white/40 shadow-2xl bg-white/50 backdrop-blur-xl">

              <div className="relative h-[450px] md:h-[700px]">

                <Image
                  src="/img/about-us/delevery-boy.jpg"
                  alt="delivery"
                  fill
                  className="object-cover"
                />

                {/* overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              </div>

              {/* floating glass card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="absolute bottom-6 left-6 right-6 backdrop-blur-xl bg-white/70 border border-white/40 rounded-2xl p-5 shadow-xl"
              >

                <p className="text-sm text-gray-500 mb-1">
                  Trusted by thousands
                </p>

                <h3 className="text-2xl font-semibold text-gray-900">
                  Fast & reliable grocery delivery
                </h3>

              </motion.div>

            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default AboutUs;