"use client";

import React from "react";
import {
  FaPhoneSquareAlt,
  FaFacebook,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
} from "react-icons/fa";

import { FaLocationDot, FaTelegram } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { AiFillInstagram } from "react-icons/ai";
import { FaXTwitter } from "react-icons/fa6";

import Link from "next/link";
import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";

/* =========================
   DATA
========================= */

const fakeSocialLink = [
  { icon: FaFacebook, link: "#" },
  { icon: AiFillInstagram, link: "#" },
  { icon: FaXTwitter, link: "#" },
  { icon: FaTelegram, link: "#" },
];

const navigationData = [
  { name: "Home", link: "/" },
  { name: "Products", link: "/shop" },
];

const paymentMethods = [
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
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
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const socialVariant = {
  hover: {
    y: -4,
    scale: 1.08,
    transition: {
      duration: 0.25,
    },
  },
};

/* =========================
   COMPONENT
========================= */

const Footer = () => {
  return (
    <footer className="relative bg-[#0b1510] text-white overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute w-[500px] h-[500px] bg-green-500/10 blur-[140px] -top-20 -left-20" />

      <div className="absolute w-[400px] h-[400px] bg-emerald-500/10 blur-[140px] bottom-0 right-0" />

      {/* GRID */}
      <motion.div
        variants={containerVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-screen-2xl mx-auto px-5 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14 relative z-10"
      >

        {/* ================= ABOUT ================= */}

        <motion.div
          variants={fadeUp}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Crisop{" "}
              <span className="text-emerald-400">
                Market
              </span>
            </h1>

            <p className="mt-5 text-sm leading-relaxed text-white/60">
              AI-powered grocery delivery platform focused on speed,
              freshness, and modern shopping experiences for the future.
            </p>
          </div>

          {/* SOCIAL */}
          <div className="flex gap-3">
            {fakeSocialLink.map((dt, index) => (
              <motion.a
                key={index}
                href={dt.link}
                target="_blank"
                variants={socialVariant}
                whileHover="hover"
                className="w-11 h-11 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center hover:bg-emerald-500 hover:border-emerald-500 transition-all duration-300"
              >
                {React.createElement(dt.icon, {
                  className: "text-lg",
                })}
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* ================= CONTACT ================= */}

        <motion.div
          variants={fadeUp}
          className="space-y-6"
        >
          <h1 className="text-xl font-semibold">
           Developer Contact
          </h1>

          <div className="space-y-5 text-sm text-white/70">

            <motion.div
              whileHover={{ x: 4 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <FaPhoneSquareAlt className="text-emerald-400" />
              </div>

              <span>+880 1883992408</span>
            </motion.div>

            <motion.div
              whileHover={{ x: 4 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <MdEmail className="text-emerald-400" />
              </div>

              <span>mridul.sheikh.90@gmail.com</span>
            </motion.div>

            <motion.div
              whileHover={{ x: 4 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <Linkedin className="text-emerald-400" />
              </div>

              <span>
                /in/mridul-sheikh
              </span>
            </motion.div>

          </div>
        </motion.div>

        {/* ================= LINKS ================= */}

        <motion.div
          variants={fadeUp}
          className="space-y-6"
        >
          <h1 className="text-xl font-semibold">
            Quick Links
          </h1>

          <ul className="flex flex-col gap-y-4 text-sm text-white/70">
            {navigationData.map((dt, index) => (
              <motion.li
                key={index}
                whileHover={{ x: 4 }}
              >
                <Link
                  href={dt.link}
                  className="hover:text-emerald-400 transition"
                >
                  {dt.name}
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* ================= PAYMENT ================= */}

        <motion.div
          variants={fadeUp}
          className="space-y-6"
        >
          <h1 className="text-xl font-semibold">
            Secure Payments
          </h1>

          <p className="text-sm text-white/60 leading-relaxed">
            Safe and encrypted payment methods supported for fast and
            seamless checkout experiences.
          </p>

          {/* PAYMENT CARDS */}
          <div className="flex gap-4">

            {paymentMethods.map((Icon, index) => (
              <motion.div
                key={index}
                whileHover={{
                  y: -5,
                  scale: 1.05,
                }}
                className="w-16 h-14 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center text-3xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <Icon />
              </motion.div>
            ))}

          </div>

          {/* GLASS CARD */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-5 rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl"
          >
            <p className="text-sm text-white/60">
              Trusted by thousands of customers for secure online grocery shopping.
            </p>
          </motion.div>
        </motion.div>

      </motion.div>

      {/* ================= BOTTOM ================= */}

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        viewport={{ once: true }}
        className="border-t border-white/10"
      >
        <div className="max-w-screen-2xl mx-auto px-5 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-xs text-white/40 text-center md:text-left">
            © 2026 Crisop Market. All rights reserved.
          </p>

          <div className="flex items-center gap-5 text-xs text-white/40">
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms & Conditions</Link>
          </div>

        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;