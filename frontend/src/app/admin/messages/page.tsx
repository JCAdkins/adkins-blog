"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fetchMessages, markMessageAsRead } from "@/lib/db/queries";
import SkeletonMessage from "@/components/skeletons/message-skeleton";
import { useMessageContext } from "@/contexts/message-context";

type Message = {
  id: string;
  subject: string;
  message: string;
  name: string;
  email: string;
  createdAt: string;
  read: boolean;
};

export default function AdminMessagesPage() {
  const { setUnreadCount } = useMessageContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [showRead, setShowRead] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openMessageId, setOpenMessageId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndSetMessages = async () => {
      const msgs = await fetchMessages();
      setMessages(msgs);
      console.log("messages: ", messages);
      setLoading(false);
    };
    fetchAndSetMessages();
  }, []);

  const filteredMessages = messages.filter((msg) => showRead || !msg.read);

  return (
    <div className="space-y-4 p-6">
      <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
        <h1 className="text-2xl font-bold">Admin Messages</h1>
        <Button variant="outline" onClick={() => setShowRead((prev) => !prev)}>
          {showRead ? "Hide Read Messages" : "Show Read Messages"}
        </Button>
      </div>

      <ul className="space-y-2">
        {loading
          ? Array.from({ length: 5 }).map((_, idx) => (
              <SkeletonMessage key={idx} />
            ))
          : filteredMessages.map((msg) => (
              <li
                key={msg.id}
                className={cn(
                  "rounded border p-2 shadow-sm transition-colors md:p-3",
                  msg.read ? "bg-gray-300" : "bg-white",
                )}
              >
                <div
                  className="cursor-pointer space-y-1"
                  onClick={() => {
                    if (openMessageId && openMessageId !== msg.id) {
                      const prevMsg = messages.find(
                        (m) => m.id === openMessageId,
                      );
                      if (prevMsg && !prevMsg.read) {
                        markMessageAsRead(prevMsg.id).then(() => {
                          setMessages((prev) =>
                            prev.map((m) =>
                              m.id === prevMsg.id ? { ...m, read: true } : m,
                            ),
                          );
                          setUnreadCount((prev: number) => prev - 1);
                        });
                      }
                    }

                    if (openMessageId === msg.id) {
                      // Closing the currently open message
                      const currentMsg = messages.find((m) => m.id === msg.id);
                      if (currentMsg && !currentMsg.read) {
                        markMessageAsRead(msg.id).then(() => {
                          setMessages((prev) =>
                            prev.map((m) =>
                              m.id === msg.id ? { ...m, read: true } : m,
                            ),
                          );
                          setUnreadCount((prev: number) => prev - 1);
                        });
                      }
                      setOpenMessageId(null);
                    } else {
                      setOpenMessageId(msg.id);
                    }
                  }}
                >
                  <div className="flex items-center justify-between text-sm md:text-base">
                    <span className="font-medium">{msg.subject}</span>
                    <span className="text-muted-foreground text-xs md:text-sm">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs md:text-sm">
                    From: <span className="font-medium">{msg.name}</span> (
                    {msg.email})
                  </p>
                </div>

                {openMessageId === msg.id && (
                  <div className="mt-2 border-t pt-2 text-sm whitespace-pre-wrap text-gray-700">
                    {msg.message}
                  </div>
                )}
              </li>
            ))}
      </ul>
    </div>
  );
}
