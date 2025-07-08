import { BellIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useNotifications } from "@/contexts/notifications-context";

export function NotificationBadge() {
  const { unreadCount } = useNotifications();

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
