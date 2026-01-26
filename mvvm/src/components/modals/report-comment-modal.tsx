// src/components/modals/ReportCommentModal.tsx
"use client";

import { BaseModal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useModalContext } from "@/contexts/modals-context";
import { useState } from "react";

export function ReportCommentModal() {
  const { reportOptions, close } = useModalContext();
  const [reason, setReason] = useState("");

  if (!reportOptions) return null;

  const { commentId } = reportOptions;

  const submitReport = async () => {
    // TODO: wire backend call
    console.log("Reporting comment:", commentId, "Reason:", reason);
    setReason("");
    close();
  };

  return (
    <BaseModal isOpen onClose={close} title="Report Comment">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Please tell us why you’re reporting this comment.
        </p>

        <textarea
          className="w-full rounded border p-2 text-sm"
          rows={4}
          placeholder="Reason for reporting…"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={() => {
              setReason("");
              close();
            }}
          >
            Cancel
          </Button>
          <Button
            className="cursor-pointer"
            variant="destructive"
            disabled={!reason.trim()}
            onClick={submitReport}
          >
            Report
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
