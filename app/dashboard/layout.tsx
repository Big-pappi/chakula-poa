"use client";

import React from "react"

import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <main className="lg:pl-72">
        <div className="pt-14 lg:pt-0">{children}</div>
      </main>
    </div>
  );
}
