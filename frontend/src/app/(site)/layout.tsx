import Footer from "@/components/ui/layout/Navbar/Footer";
import NavBar from "@/components/ui/layout/Navbar/NavBar";
import React from "react";

const NormalLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className=" overflow-x-hidden">
      <NavBar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default NormalLayout;
