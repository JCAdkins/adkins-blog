// src/components/modals/ConfirmModal.tsx
"use client";

import { Button } from "@/components/ui/button";
import { BaseModal } from "@/components/ui/modal";
import { useModalContext } from "@/contexts/modals-context";

export function ConfirmModal() {
  const { confirmOptions, close } = useModalContext();

  if (!confirmOptions) return null;

  const {
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
  } = confirmOptions;

  return (
    <BaseModal isOpen onClose={close} title={title}>
      {description && <p>{description}</p>}

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" className="cursor-pointer" onClick={close}>
          {cancelText}
        </Button>

        <Button
          variant="destructive"
          className="cursor-pointer"
          onClick={() => {
            onConfirm();
            close();
          }}
        >
          {confirmText}
        </Button>
      </div>
    </BaseModal>
  );
}
