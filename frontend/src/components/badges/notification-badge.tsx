// src/components/notifications/notification-badge.tsx
"use client";

import { BellIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export function NotificationBadge() {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await fetch(
          `/api/notifications/unread?id=${session?.user.id}`
        );
        const data = await res.json();
        setUnreadCount(data.length);
      } catch (err) {
        console.error("Failed to fetch unread notifications", err);
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <Link href="/notifications" className="relative">
      <BellIcon className="h-6 w-6" />
      {unreadCount > 0 && (
        <div className="flex absolute -top-1 -right-1">
          <Badge size="sm" variant="destructive">
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        </div>
      )}
    </Link>
  );
}
