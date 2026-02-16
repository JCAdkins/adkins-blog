"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { isToday, isThisWeek, isThisMonth, isThisYear } from "date-fns";
import {
  getUserNotifications,
  markAllNotificationsAsRead,
} from "@/lib/db/queries";
import { Notification } from "@/models/notificationModel";
import { toast } from "sonner";
import { useNotifications } from "@/contexts/notifications-context";

export function useNotificationsViewModel() {
  const { data: session } = useSession();
  const { setUnreadCount } = useNotifications();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const page = useRef(0);
  const didInit = useRef(false);
  const observer = useRef<IntersectionObserver | null>(null);

  /* ---------------- Fetching ---------------- */

  const loadMore = useCallback(async () => {
    if (!session?.user?.id || loading || !hasMore) return;

    setLoading(true);

    const { notifications: newNotifications, canLoadMore } =
      await getUserNotifications(session.user.id, page.current);

    if (newNotifications.length > 0) {
      setNotifications((prev) => [...prev, ...newNotifications]);
      page.current += 1;
    }

    setHasMore(canLoadMore);
    setLoading(false);
  }, [session?.user?.id, loading, hasMore]);

  useEffect(() => {
    if (!didInit.current && notifications.length === 0) {
      loadMore();
      didInit.current = true;
    }
  }, [loadMore, notifications.length]);

  /* ---------------- Infinite scroll ---------------- */

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
    [loading, loadMore],
  );

  /* ---------------- Grouping ---------------- */

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
    {} as Record<string, Notification[]>,
  );

  /* ---------------- Actions ---------------- */

  const markAllAsRead = async () => {
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

  return {
    groupedNotifications,
    notifications,
    loading,
    hasMore,
    lastNotificationRef,
    markAllAsRead,
  };
}
