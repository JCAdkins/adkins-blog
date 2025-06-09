"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  className?: string;
};

export function Drawer({
  open,
  onOpenChange,
  className,
  children,
}: DrawerProps) {
  return (
    // Animation for this component is located in /styles/globals.css
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          id="admin-sidebar-overlay"
          className={cn("fixed inset-0 z-40 backdrop-blur-sm")}
        />

        <Dialog.Content
          id="admin-sidebar-content"
          className={cn(
            "fixed top-0 left-0 z-50 h-full w-64 shadow-lg",
            className,
          )}
        >
          <div className="flex items-center justify-between border-b bg-white p-3">
            <Dialog.Title className="text-lg font-semibold">
              Admin Menu
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-600 hover:text-black focus:outline-none">
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">
            Select a page to navigate to in the admin panel.
          </Dialog.Description>
          <div className="overflow-y-auto p-4">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
