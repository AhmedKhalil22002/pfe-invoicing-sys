import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';

interface ChoiceDialogProps {
  className?: string;
  prompt?: React.ReactNode;
  open: boolean;
  onClose: Function;
  description?: React.ReactNode;
  positiveCallback?: Function;
  negativeCallback?: Function;
}

export const ChoiceDialog = ({
  className,
  prompt,
  open,
  onClose,
  description,
  positiveCallback,
  negativeCallback
}: ChoiceDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{prompt}</DialogTitle>
          <DialogDescription> {description}</DialogDescription>
        </DialogHeader>
        <div>
          <div>
            <Button
              className="ml-1"
              onClick={() => {
                positiveCallback?.();
                onClose();
              }}>
              Oui
            </Button>
            <Button
              className="ml-2"
              onClick={() => {
                negativeCallback?.();
                onClose();
              }}>
              Non
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
