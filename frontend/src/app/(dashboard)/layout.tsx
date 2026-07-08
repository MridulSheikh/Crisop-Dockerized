import React from "react";
import Footer from "@/components/ui/layout/Navbar/Footer";
import NavBar from "@/components/ui/layout/Navbar/NavBar";
import PrivateRoute from "@/components/protected-route/PrivateRoute";

const Dashboard = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <NavBar />
      <PrivateRoute>
        {/* Main Content */}
        <main className="md:pt-20 bg-[#f6f6f6]">
          {/* Main Content Area */}
          <section className="p-5 w-full">{children}</section>
        </main>

        {/* Footer */}
        <Footer />
      </PrivateRoute>
    </div>
  );
};

export default Dashboard;
