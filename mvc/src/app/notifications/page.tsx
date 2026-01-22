"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import NotificationCard from "@/components/cards/notifications-card";
import {
  getUserNotifications,
  markAllNotificationsAsRead,
} from "@/lib/db/queries";
import { isToday, isThisWeek, isThisYear, isThisMonth } from "date-fns";
import { SettingsIcon } from "lucide-react";
import { Notification } from "../../../next-auth";
import { toast } from "sonner";
import { useNotifications } from "@/contexts/notifications-context";

export default function NotificationsPage() {
  const { data: session } = useSession();
  const { setUnreadCount } = useNotifications();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const didInit = useRef(false);
  const page = useRef(0);
  const observer = useRef<IntersectionObserver | null>(null);

  const loadMore = useCallback(async () => {
    if (!session?.user?.id || loading || !hasMore) return;

    setLoading(true);

    const { notifications: newNotifications, canLoadMore } =
      await getUserNotifications(session.user.id, page.current);

    if (newNotifications.length > 0) {
      setNotifications((prev) => [...prev, ...newNotifications]);
      page.current += 1;
    }
    // Always update `hasMore` based on backend result
    setHasMore(canLoadMore);
    setLoading(false);
  }, [session?.user?.id, loading, hasMore]);

  // Ensures loadMore is only called once upon page load
  useEffect(() => {
    if (!didInit.current && notifications.length === 0) {
      loadMore();
      didInit.current = true;
    }
  }, [loadMore, notifications.length]);

  const lastNotificationRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, loadMore]
  );

  const groupByTime = (notification: Notification) => {
    const createdAt = new Date(notification.createdAt);
    if (isToday(createdAt)) return "Today";
    if (isThisWeek(createdAt)) return "This Week";
    if (isThisMonth(createdAt)) return "This Month";
    if (isThisYear(createdAt)) return "This Year";
    return "Earlier";
  };

  const groupedNotifications = notifications.reduce(
    (acc, notif) => {
      const key = groupByTime(notif);
      if (!acc[key]) acc[key] = [];
      acc[key].push(notif);
      return acc;
    },
    {} as Record<string, Notification[]>
  );

  const handleMarkAllAsRead = async () => {
    if (!session?.user?.id) return;
    const { error } = await markAllNotificationsAsRead(session.user.id);
    if (error) {
      toast.error(error);
      return;
    }

    toast.success("All notifications marked as read!");
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const allNotificationsFlat = notifications;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex items-center gap-3">
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={handleMarkAllAsRead}
          >
            Mark All As Read
          </Button>
          <Button className="cursor-pointer" variant="ghost" size="icon">
            <SettingsIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {Object.entries(groupedNotifications).map(([section, notifs]) => (
        <div key={section} className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-700">{section}</h2>
          {notifs.map((notif) => {
            const isLast =
              allNotificationsFlat[allNotificationsFlat.length - 1]?.id ===
              notif.id;
            return (
              <div key={notif.id} ref={isLast ? lastNotificationRef : null}>
                <NotificationCard
                  className={`${notif.read ? "bg-header/60" : "bg-header"} rounded-md`}
                  notification={notif}
                />
              </div>
            );
          })}
        </div>
      ))}

      {loading && (
        <p className="text-center text-muted-foreground">Loading more...</p>
      )}
      {!hasMore && (
        <p className="text-center text-muted-foreground">
          No more notifications.
        </p>
      )}
    </div>
  );
}
