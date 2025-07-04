import { MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type NotificationCardProps = {
  className: string;
  notification: {
    id: string;
    message: string;
    read: boolean;
    createdAt: string;
    actorId?: string;
  };
};

export default function NotificationCard({
  notification,
  className = "",
}: NotificationCardProps) {
  const handleHide = () => {
    console.log("Hide", notification.id);
  };

  const handleDisable = () => {
    console.log("Disable notifications from", notification.actorId);
  };

  const handleAdvanced = () => {
    console.log("Advanced options for", notification.id);
  };

  return (
    <Card
      className={cn(
        "relative border px-4 py-3 transition-all",
        !notification.read && "bg-muted",
        className
      )}
      footer={
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{new Date(notification.createdAt).toLocaleString()}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 hover:text-foreground text-muted-foreground">
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
      <p className="text-sm text-black">{notification.message}</p>
    </Card>
  );
}
