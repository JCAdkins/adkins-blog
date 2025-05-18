import { ReactNode } from "react";
import { AuthGuard } from "@/components/auth-guard";
import AdminSidebar from "@/components/sidebars/admin-sidebar";
import AdminHeader from "@/components/headers/admin-header";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex flex-grow flex-col">
          <AdminHeader />
          <main className="overflow-y-auto p-4">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
