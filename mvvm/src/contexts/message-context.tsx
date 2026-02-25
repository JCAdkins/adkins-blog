// context/MessageContext.tsx
"use client";

import { getUnreadMessagesCount } from "@/lib/services/contact-service";
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
      const res = await getUnreadMessagesCount();
      setUnreadCount(res);
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
