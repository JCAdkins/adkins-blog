import { ReactNode } from "react";
import { AuthGuard } from "@/components/auth-guard";
import AdminSidebar from "@/components/sidebars/admin-sidebar";
import AdminHeader from "@/components/headers/admin-header";
import { MessageProvider } from "@/contexts/message-context";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <MessageProvider>
        <div className="flex h-screen">
          <AdminSidebar />
          <div className="flex flex-grow flex-col">
            <AdminHeader />
            <main className="overflow-y-auto p-4">{children}</main>
          </div>
        </div>
      </MessageProvider>
    </AuthGuard>
  );
}
