// src/hooks/useConfirmModal.ts
import { useModalContext } from "@/contexts/modals-context";

export function useConfirmModal() {
  const { openConfirm, close } = useModalContext();

  return {
    open: openConfirm,
    close,
  };
}
