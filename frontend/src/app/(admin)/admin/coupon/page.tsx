"use client";

import { useEffect, useState } from "react";
import AddCoupon from "@/components/ui/admin/coupon/AddCoupon";
import EditCoupon from "@/components/ui/admin/coupon/EditCoupon";
import DeleteCouponConfirmModal from "@/components/ui/admin/coupon/DeleteCouponConfirmModal";

type Coupon = {
  id: string;
  code: string;
  description: string;
  discount: number; // e.g., "10%" or "$5"
  expiryDate: string; // ISO date string
  active: boolean;
  used: number;
  maxUses: number;
};

const CouponsPage = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    // Replace with your API call
    setCoupons([
      {
        id: "cpn-001",
        code: "SPRING10",
        description: "10% off spring sale",
        discount: 10,
        expiryDate: "2025-06-30",
        active: true,
        used: 30,
        maxUses: 100,
      },
      {
        id: "cpn-002",
        code: "WELCOME5",
        description: "$5 off for new customers",
        discount: 5,
        expiryDate: "2025-12-31",
        active: true,
        used: 10,
        maxUses: 50,
      },
      {
        id: "cpn-003",
        code: "SUMMER15",
        description: "15% off summer special",
        discount: 15,
        expiryDate: "2024-08-15",
        active: false,
        used: 75,
        maxUses: 75,
      },
    ]);
  }, []);

  // Helper to format date nicely
  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Coupon</h1>
        <AddCoupon
          onAdd={(coupon) => {
            console.log("Coupon created:", coupon);
            // Handle coupon logic (e.g., API call or local update)
          }}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3 border-b">Code</th>
              <th className="p-3 border-b">Description</th>
              <th className="p-3 border-b">Discount</th>
              <th className="p-3 border-b">Expiry Date</th>
              <th className="p-3 border-b">Usage</th> {/* Added */}
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {coupons.map((coupon) => (
              <tr
                key={coupon.id}
                className="hover:bg-gray-50 transition duration-150"
              >
                <td className="p-3 font-medium text-gray-800">{coupon.code}</td>
                <td className="p-3 text-gray-600">{coupon.description}</td>
                <td className="p-3 text-gray-600">{coupon.discount}%</td>
                <td className="p-3 text-gray-600">
                  {formatDate(coupon.expiryDate)}
                </td>
                <td className="p-3 text-gray-600">
                  {coupon.used} / {coupon.maxUses}
                </td>
                <td
                  className={`p-3 font-semibold ${
                    coupon.active ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {coupon.active ? "Active" : "Expired"}
                </td>
                <td className="p-3 text-right space-x-3">
                  <EditCoupon
                    coupon={coupon}
                    onEdit={(id, updatedData) => {
                      console.log("Edit coupon", id, updatedData);
                    }}
                  />
                  <DeleteCouponConfirmModal />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CouponsPage;
