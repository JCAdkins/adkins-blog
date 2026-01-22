import { Drawer } from "../ui/drawer";
import Link from "next/link";
import { useMessageContext } from "@/contexts/message-context";

type AdminMobileSidebarProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMenuClick: () => void;
};

export default function AdminMobileSidebar({
  open,
  onOpenChange,
}: AdminMobileSidebarProps) {
  const { unreadCount } = useMessageContext();

  return (
    <Drawer open={open} onOpenChange={onOpenChange} className="bg-sidebar">
      <aside className="w-full space-y-4 p-4 text-black">
        <h2 className="text-xl font-bold">Admin</h2>
        <ul className="space-y-2">
          <Link href="/admin" onClick={() => onOpenChange(false)}>
            <li className="hover:bg-header w-full rounded-sm p-2">Dashboard</li>
          </Link>
          <Link href="/admin/blogs" onClick={() => onOpenChange(false)}>
            <li className="hover:bg-header w-full rounded-sm p-2">Blogs</li>
          </Link>
          <Link href="/admin/users" onClick={() => onOpenChange(false)}>
            <li className="hover:bg-header w-full rounded-sm p-2">Users</li>
          </Link>
          <Link href="/admin/messages" onClick={() => onOpenChange(false)}>
            <li className="hover:bg-header flex w-full items-center justify-between rounded-sm p-2">
              Messages
              {unreadCount > 0 && (
                <span className="ml-2 rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </li>
          </Link>
        </ul>
      </aside>
    </Drawer>
  );
}
