// AdminSidebar.tsx
"use client";

import { useMessageContext } from "../../contexts/message-context";
import Link from "next/link";

export default function AdminSidebar() {
  const { unreadCount } = useMessageContext();

  return (
    <aside className="bg-sidebar h-screen w-64 space-y-4 p-4 text-black">
      <h2 className="text-xl font-bold">Admin</h2>
      <ul className="space-y-2">
        <Link href="/admin">
          <li className="hover:bg-header w-full rounded-sm p-2">Dashboard</li>
        </Link>
        <Link href="/admin/blogs">
          <li className="hover:bg-header w-full rounded-sm p-2">Blogs</li>
        </Link>
        <Link href="/admin/users">
          <li className="hover:bg-header w-full rounded-sm p-2">Users</li>
        </Link>
        <Link href="/admin/messages">
          <li className="hover:bg-header flex w-full items-center justify-between rounded-sm p-2">
            Messages
            {unreadCount > 0 && (
              <span className="ml-2 rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">
                {unreadCount}
              </span>
            )}
          </li>
        </Link>
      </ul>
    </aside>
  );
}
