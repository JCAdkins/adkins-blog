import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Description,
} from "@headlessui/react";
import { ReactNode } from "react";

type BaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
};

export function BaseModal({
  isOpen,
  onClose,
  title,
  description,
  children,
}: BaseModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-sm rounded bg-white dark:bg-dark-card dark:border dark:border-dark-border p-6 text-black dark:text-[#e0d6f0] shadow-lg space-y-4">
          {title && (
            <DialogTitle className="text-lg font-bold dark:text-[#e0d6f0]">
              {title}
            </DialogTitle>
          )}
          {description && (
            <Description className="text-sm text-muted-foreground dark:text-[#a89bc2]">
              {description}
            </Description>
          )}
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
