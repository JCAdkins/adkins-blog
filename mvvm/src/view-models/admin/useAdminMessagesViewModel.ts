import { useMessageContext } from "@/contexts/message-context";
import { useEffect, useState } from "react";
import { Message } from "../../../next-auth";

export const useAdminMessagesViewModel = () => {
  const { setUnreadCount } = useMessageContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [showRead, setShowRead] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openMessageId, setOpenMessageId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndSetMessages = async () => {
      const res = await fetch("/api/admin/messages");
      const msgs = await res.json();
      setMessages(msgs);
      setLoading(false);
    };
    fetchAndSetMessages();
  }, []);

  const filteredMessages = messages.filter((msg) => showRead || !msg.read);

  return {
    filteredMessages,
    setUnreadCount,
    showRead,
    setShowRead,
    openMessageId,
    setOpenMessageId,
    messages,
    setMessages,
    loading,
  };
};
