"use client";

import { fetchUnread } from "@/lib/db/queries";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminSidebar() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchAndSetUnread = async () => {
      try {
        console.log("fetching count...");
        const count = await fetchUnread();
        setUnreadCount(count);
        console.log("unread count: ", unreadCount);
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };

    fetchAndSetUnread();
  }, []);

  return (
    <aside className="bg-sidebar w-64 space-y-4 p-4 text-black">
      <h2 className="text-xl font-bold">Admin</h2>
      <ul className="space-y-2">
        <Link href="/admin">
          <li className="hover:bg-header w-full rounded-sm p-2">Dashboard</li>
        </Link>
        <Link href="/admin/posts">
          <li className="hover:bg-header w-full rounded-sm p-2">Posts</li>
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
