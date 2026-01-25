// src/contexts/modals-context.tsx
"use client";

import { createContext, useContext, useState } from "react";

type ConfirmOptions = {
  title: string;
  description?: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
};

type ReportOptions = {
  commentId: string;
};

type ModalContextValue = {
  confirmOptions: ConfirmOptions | null;
  reportOptions: ReportOptions | null;

  openConfirm: (options: ConfirmOptions) => void;
  openReport: (options: ReportOptions) => void;
  close: () => void;
};

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [confirmOptions, setConfirmOptions] = useState<ConfirmOptions | null>(
    null,
  );
  const [reportOptions, setReportOptions] = useState<ReportOptions | null>(
    null,
  );

  const close = () => {
    setConfirmOptions(null);
    setReportOptions(null);
  };

  return (
    <ModalContext.Provider
      value={{
        confirmOptions,
        reportOptions,
        openConfirm: setConfirmOptions,
        openReport: setReportOptions,
        close,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModalContext() {
  const ctx = useContext(ModalContext);
  if (!ctx)
    throw new Error("useModalContext must be used inside ModalProvider");
  return ctx;
}
