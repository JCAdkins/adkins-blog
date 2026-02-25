import { useMessageContext } from "@/contexts/message-context";
import { getMessages } from "@/lib/db/queries";
import { Message } from "@/models/messageModel";
import { useEffect, useState } from "react";

export const useAdminMessagesViewModel = () => {
  const { setUnreadCount } = useMessageContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [showRead, setShowRead] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openMessageId, setOpenMessageId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndSetMessages = async () => {
      const msgs = await getMessages();
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
