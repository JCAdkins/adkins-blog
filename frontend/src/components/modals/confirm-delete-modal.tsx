import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Description,
} from "@headlessui/react";
import { Button } from "../ui/button";

export const ConfirmDeleteModal = ({
  isOpen,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  return (
    <Dialog open={isOpen} onClose={onCancel} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-sm rounded bg-white p-6 text-black shadow-lg space-y-4">
          <DialogTitle className="text-lg font-bold text-red-600">
            Confirm Deletion
          </DialogTitle>
          <Description>
            Are you sure you want to delete this comment?
          </Description>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={onCancel}
              className="hover:cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              className="hover:cursor-pointer"
            >
              Delete
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
