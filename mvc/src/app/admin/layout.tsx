"use client";

import { ReactNode, useState } from "react";
import AdminSidebar from "@/components/sidebars/admin-sidebar";
import AdminHeader from "@/components/headers/admin-header";
import { MessageProvider } from "@/contexts/message-context";
import AdminMobileSidebar from "@/components/sidebars/admin-mobile-sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <MessageProvider>
      <div className="flex h-screen">
        {/* Sidebar on desktop */}
        <div className="hidden md:block">
          <AdminSidebar />
        </div>

        {/* Mobile drawer */}
        <div className="bg-sidebar block md:hidden">
          <AdminMobileSidebar
            open={drawerOpen}
            onOpenChange={setDrawerOpen}
            onMenuClick={() => setDrawerOpen(true)}
          />
        </div>

        {/* Main content */}
        <div className="flex w-full flex-grow flex-col">
          <AdminHeader onMenuClick={() => setDrawerOpen(true)} />
          <main className="overflow-y-auto p-4">{children}</main>
        </div>
      </div>
    </MessageProvider>
  );
}
