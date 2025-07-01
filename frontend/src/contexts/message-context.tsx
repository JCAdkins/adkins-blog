// context/MessageContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type MessageContextType = {
  unreadCount: number;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
};

const MessageContext = createContext<MessageContextType>({
  unreadCount: 0,
  setUnreadCount: () => {},
});

export const MessageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/admin/messages/unread/count");
      const count = await res.json();
      setUnreadCount(count);
    };
    load();
  }, []);

  return (
    <MessageContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessageContext = () => useContext(MessageContext);
