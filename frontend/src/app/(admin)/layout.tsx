import PrivateRoute from "@/components/protected-route/PrivateRoute";
import Sidebar from "@/components/ui/admin/Sidebar";
import React, { ReactNode } from "react";
const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <PrivateRoute>
      <main>
        <div className="min-h-screen bg-[#f6f6f6]">
          <Sidebar />
          <div className="min-h-screen bg-[#f6f6f6] pt-16 lg:ml-72 lg:pt-0">
            {children}
          </div>
        </div>
      </main>
    </PrivateRoute>
  );
};

export default AdminLayout;
