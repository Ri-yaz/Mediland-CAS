import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { checkDoctorStatus } from "@/utils/check-doctor-status";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  // Check if doctor is unauthorized and trying to access non-dashboard pages
  const { isDoctor, status } = await checkDoctorStatus();
  const headerList = await headers();
  const currentPath = headerList.get("x-url") || "";

  // If doctor is not authorized (PENDING status), only allow access to /doctor page (dashboard)
  // We allow /doctor and any subpaths if needed, but usually it's just /doctor
  if (isDoctor && status === "PENDING") {
    if (currentPath !== "/doctor") {
      redirect("/doctor");
    }
  }

  return (
    <div className="w-full h-screen flex bg-gray-200">
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%]">
        <Sidebar />
      </div>

      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] flex flex-col">
        <Navbar />

        <div className="h-full w-full p-2 overflow-y-scroll">{children}</div>
      </div>
    </div>
  );
};

export default ProtectedLayout;
