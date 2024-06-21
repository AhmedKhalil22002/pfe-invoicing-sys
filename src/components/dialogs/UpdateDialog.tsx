import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';

interface ChoiceDialogProps {
  className?: string;
  label?: React.ReactNode;
  open: boolean;
  onClose: () => void;
  form?: React.ReactNode;
  positiveCallback?: () => void;
  negativeCallback?: () => void;
}

export const UpdateDialog = ({
  className,
  label,
  open,
  onClose,
  form,
  positiveCallback,
  negativeCallback
}: ChoiceDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
        </DialogHeader>
        <div className="-mt-2">{form}</div>
        <div className="mt-3">
          <Button
            className="mr-2"
            onClick={() => {
              positiveCallback?.();
              onClose();
            }}>
            Enregistrer
          </Button>
          <Button
            className="mr-2"
            onClick={() => {
              negativeCallback?.();
              onClose();
            }}>
            Annuler
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
