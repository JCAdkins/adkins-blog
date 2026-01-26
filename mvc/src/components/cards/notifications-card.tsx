"use client";

import { MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn, formatDateToShortDateTime } from "@/lib/utils";
import { BlogComment } from "next-auth";
import { markNotificationAsRead } from "@/lib/db/queries";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useNotifications } from "@/contexts/notifications-context";

type NotificationCardProps = {
  className?: string;
  notification: {
    id: string;
    message: string;
    read: boolean;
    createdAt: string;
    actorId?: string;
    comment?: BlogComment;
    type: "LIKE" | "REPLY";
    reply?: BlogComment;
  };
};

export default function NotificationCard({
  notification,
  className = "",
}: NotificationCardProps) {
  const handleHide = () => {
    console.log("Hide", notification.id);
  };
  const router = useRouter();

  const handleDisable = () => {
    console.log("Disable notifications from", notification.actorId);
  };

  const handleAdvanced = () => {
    console.log("Advanced options for", notification.id);
  };

  {
    /* slice(0,30) ensures the entire comment will not be displayed, rather only the
          first 30 characters. If the user wants to see full comment they can click on 
          the notification 
      */
  }
  let content;
  if (notification.type === "LIKE")
    content = notification.comment?.content
      ? notification.comment.content.length > 30
        ? `"${notification.comment.content.slice(0, 30)}..."`
        : `"${notification.comment.content}"`
      : null;
  else
    content = notification.reply?.content
      ? notification.reply.content.length > 30
        ? `"${notification.reply.content.slice(0, 30)}..."`
        : `"${notification.reply.content}"`
      : null;

  const { setUnreadCount } = useNotifications();

  return (
    <Card
      className={cn(
        "relative border px-4 py-3 transition-all",
        !notification.read && "bg-muted",
        className,
      )}
      footer={
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{formatDateToShortDateTime(notification.createdAt)}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 hover:text-foreground text-muted-foreground cursor-pointer">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleHide}>Hide</DropdownMenuItem>
              <DropdownMenuItem onClick={handleDisable}>
                Disable from this user
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleAdvanced}>
                Advanced
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      }
    >
      <div
        className="text-sm text-black cursor-pointer"
        onClick={async () => {
          if (!notification.read) {
            const { error } = await markNotificationAsRead(notification.id);
            setUnreadCount((prev) => prev - 1);
            if (error) {
              toast.error(error);
              return;
            }
          }
          const commentId = notification.comment?.id;
          const replyId = notification.reply?.id;
          const postId = notification.comment?.postId;

          if (notification.type === "LIKE") {
            // Redirect to post and scroll to comment anchor
            router.push(`/blog/${postId}?commentId=${commentId}`);
          } else {
            router.push(`/blog/${postId}?commentId=${replyId}`);
          }
        }}
      >
        <b>{notification.message}:</b> {content}
      </div>
    </Card>
  );
}
