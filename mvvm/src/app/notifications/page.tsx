"use client";

import { Button } from "@/components/ui/button";
import NotificationCard from "@/components/cards/notifications-card";
import { SettingsIcon } from "lucide-react";
import { useNotificationsViewModel } from "@/view-models/notifications/useNotificationsViewModel";

export default function NotificationsPage() {
  const {
    groupedNotifications,
    notifications,
    loading,
    hasMore,
    lastNotificationRef,
    markAllAsRead,
  } = useNotificationsViewModel();

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex items-center gap-3">
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={markAllAsRead}
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
              notifications[notifications.length - 1]?.id === notif.id;

            return (
              <div key={notif.id} ref={isLast ? lastNotificationRef : null}>
                <NotificationCard
                  className={`${
                    notif.read ? "bg-header/60" : "bg-header"
                  } rounded-md`}
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
