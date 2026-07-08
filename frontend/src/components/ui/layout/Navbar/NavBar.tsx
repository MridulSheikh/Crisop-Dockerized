"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "../../button";
import { FiShoppingCart } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { useCurrentUser } from "@/redux/features/auth/authSlice";
import ProductSearchBar from "../../products/ProductSearchBar";
import {
  ClipboardList,
  Heart,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";

/* =========================
   DATA
========================= */

const navigationData = [
  { name: "Shop", link: "/shop", isAdminRoute: false },
  { name: "Admin", link: "/admin", isAdminRoute: true },
];

const bottomNav = [
  { name: "Shop", link: "/shop", icon: ShoppingBag },
  { name: "Cart", link: "/cart", icon: ShoppingCart },
  { name: "Orders", link: "/order", icon: ClipboardList },
  { name: "Wishlist", link: "/wishlist", icon: Heart },
];

const AdminAllowedRoles = ["admin", "manager", "super"];

/* =========================
   ANIMATION VARIANTS
========================= */

const navbarVariant = {
  hidden: {
    y: -120,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const navItemVariant = {
  hidden: {
    opacity: 0,
    y: -10,
  },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.4,
    },
  }),
};

const bottomNavVariant = {
  hidden: {
    y: 100,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* =========================
   COMPONENT
========================= */

const NavBar = () => {
  const [serchBarFocus, setSerchBarFocus] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  const cartItems = useAppSelector((state) => state.cart.items);
  const wishlistItems = useAppSelector((state) => state.wishlist.products);

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const user = useAppSelector(useCurrentUser);

  const pathname = usePathname();

  const isHome = pathname === "/";

  const [showSearch, setShowSearch] = useState(false);

  /* =========================
     MOBILE DETECT
  ========================= */

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);

    checkScreen();

    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  /* =========================
     SCROLL EFFECT
  ========================= */

  useEffect(() => {
    const currentScrollY = window.scrollY;

    setScrolled(currentScrollY > 20);
    setShowSearch(isHome ? currentScrollY > 120 : true);

    let lastScrollY = currentScrollY;

    const handleScroll = () => {
      const scrollY = window.scrollY;

      setScrolled(scrollY > 20);

      if (scrollY > lastScrollY && scrollY > 80) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      setShowSearch(isHome ? scrollY > 120 : true);

      lastScrollY = scrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  /* =========================
     SEARCH FOCUS
  ========================= */

  const handleFocus = () => {
    if (isMobile) setSerchBarFocus(true);
  };

  const handleBlur = () => {
    if (isMobile) setSerchBarFocus(false);
  };

  return (
    <>
      {/* =========================
          NAVBAR
      ========================= */}

      <AnimatePresence>
        {showNavbar && (
          <motion.div
            variants={navbarVariant}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={cn(
              "fixed top-0 left-0 w-full z-50 transition-all duration-300",
              {
                "bg-transparent": !scrolled && isHome,
                "bg-white/80 backdrop-blur-2xl border-b border-white/20 shadow-sm":
                  scrolled,
              },
            )}
          >
            <div className="max-w-screen-2xl mx-auto px-5">

              <div className="flex items-center py-3 lg:py-4 gap-x-3">

                {/* ================= LOGO ================= */}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className={cn("flex items-center gap-x-5", {
                    "hidden md:flex": serchBarFocus && isMobile,
                  })}
                >
                  <Link href="/">
                    <motion.div
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className="w-[90px] h-[45px] lg:w-[140px] lg:h-[45px] relative"
                    >
                      <Image
                        src="/img/logo.png"
                        alt="logo"
                        fill
                        className="object-contain"
                      />
                    </motion.div>
                  </Link>
                </motion.div>

                {/* ================= SEARCH ================= */}

                {showSearch && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className={cn("w-full transition-all", {
                      "fixed top-0 left-0 w-full bg-white z-[60] px-4 py-3":
                        serchBarFocus && isMobile,
                    })}
                  >
                    <ProductSearchBar
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      isFocused={serchBarFocus && isMobile}
                    />
                  </motion.div>
                )}

                {/* ================= RIGHT SIDE ================= */}

                <div
                  className={cn(
                    "flex items-center gap-x-2 md:gap-x-3 lg:gap-x-5 ml-auto",
                    {
                      "hidden md:flex": serchBarFocus && isMobile,
                    },
                  )}
                >

                  {/* NAV LINKS */}

                  <ul className="hidden md:flex items-center gap-x-6">
                    {navigationData.map((item, i) => (
                      <motion.li
                        key={item.link}
                        custom={i}
                        variants={navItemVariant}
                        initial="hidden"
                        animate="visible"
                        className={cn("", {
                          hidden:
                            item.isAdminRoute === true &&
                            !AdminAllowedRoles.includes(
                              user?.role as string,
                            ),
                        })}
                      >
                        <Link
                          href={item.link}
                          className={cn(
                            "relative font-medium text-gray-700 transition hover:text-green-700",
                            {
                              "text-green-700": pathname === item.link,
                            },
                          )}
                        >
                          {item.name}

                          {pathname === item.link && (
                            <motion.div
                              layoutId="navbar-indicator"
                              className="absolute -bottom-2 left-0 right-0 h-[2px] bg-green-600 rounded-full"
                            />
                          )}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>

                  {/* WISHLIST */}

                  <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href="/wishlist" className="hidden md:block">
                      <div className="relative">
                        <Heart className="text-[22px]" />

                        {wishlistItems?.length > 0 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full"
                          >
                            {wishlistItems.length}
                          </motion.span>
                        )}
                      </div>
                    </Link>
                  </motion.div>

                  {/* CART */}

                  <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href="/cart" className="hidden md:block">
                      <div className="relative">
                        <FiShoppingCart className="text-2xl" />

                        {cartCount > 0 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 bg-green-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full"
                          >
                            {cartCount}
                          </motion.span>
                        )}
                      </div>
                    </Link>
                  </motion.div>

                  {/* USER */}

                  {user ? (
                    <motion.div
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <UserAvatar
                        className="inline-block size-9"
                        userName={user.name}
                        image={user.image}
                      />
                    </motion.div>
                  ) : (
                    <Link href="/login">
                      <motion.div
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        <Button className="rounded-full bg-green-700 hover:bg-green-800">
                          Login
                        </Button>
                      </motion.div>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================
          MOBILE BOTTOM NAV
      ========================= */}

      <motion.div
        variants={bottomNavVariant}
        initial="hidden"
        animate="visible"
        className={cn(
          "fixed bottom-0 left-0 w-full md:hidden z-50",
          {
            hidden: serchBarFocus && isMobile,
          },
        )}
      >
        <div className="mx-4 mb-4 rounded-3xl border border-white/20 bg-white/80 backdrop-blur-2xl shadow-2xl px-2 py-2 flex justify-around items-center">

          {bottomNav.map((item) => {
            const Icon = item.icon;

            const isActive = pathname === item.link;

            return (
              <Link
                key={item.link}
                href={item.link}
                className="relative"
              >
                <motion.div
                  whileTap={{ scale: 0.92 }}
                  whileHover={{ y: -2 }}
                  className={cn(
                    "relative flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all",
                    {
                      "text-green-700": isActive,
                      "text-gray-500": !isActive,
                    },
                  )}
                >

                  {isActive && (
                    <motion.div
                      layoutId="bottom-nav-active"
                      className="absolute inset-0 rounded-2xl bg-green-50"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.5,
                      }}
                    />
                  )}

                  <div className="relative z-10">
                    <Icon size={20} />

                    {item.name === "Cart" && cartCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 bg-green-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full"
                      >
                        {cartCount}
                      </motion.span>
                    )}

                    {item.name === "Wishlist" &&
                      wishlistItems?.length > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full"
                        >
                          {wishlistItems.length}
                        </motion.span>
                      )}
                  </div>

                  <span className="text-[11px] font-medium relative z-10">
                    {item.name}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* SPACING */}
      <div className="h-16 md:hidden" />
    </>
  );
};

export default NavBar;