// src/hooks/useReportModal.ts
import { useModalContext } from "@/contexts/modals-context";

export function useReportModal() {
  const { openReport, close } = useModalContext();

  return {
    open: (commentId: string) => openReport({ commentId }),
    close,
  };
}
