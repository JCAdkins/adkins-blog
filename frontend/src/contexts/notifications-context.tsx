// src/contexts/NotificationsContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type NotificationsContextType = {
  unreadCount: number;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
  refreshUnreadCount: () => void;
};

const NotificationsContext = createContext<NotificationsContextType | null>(
  null
);

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const { data: session, status } = useSession();

  const refreshUnreadCount = async () => {
    if (!session?.user?.id) return;

    try {
      const res = await fetch(
        `/api/notifications/unread?id=${session.user.id}`
      );
      const data = await res.json();
      setUnreadCount(data.length);
    } catch (err) {
      console.error("Failed to fetch unread notifications", err);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      refreshUnreadCount();
      const interval = setInterval(refreshUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [status]);

  return (
    <NotificationsContext.Provider
      value={{ unreadCount, setUnreadCount, refreshUnreadCount }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationsProvider"
    );
  }
  return context;
}
