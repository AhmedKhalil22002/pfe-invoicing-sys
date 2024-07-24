import React, { useTransition } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { useTranslation } from 'react-i18next';

interface ChoiceDialogProps {
  className?: string;
  label?: React.ReactNode;
  open: boolean;
  onClose: () => void;
  description?: React.ReactNode;
  positiveCallback?: () => void;
  negativeCallback?: () => void;
}

export const ChoiceDialog = ({
  className,
  label,
  open,
  onClose,
  description,
  positiveCallback,
  negativeCallback
}: ChoiceDialogProps) => {
  const { t } = useTranslation('common');
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription className="pt-2">{description}</DialogDescription>
        </DialogHeader>
        <div className="mt-2">
          <Button
            className="mr-2"
            onClick={() => {
              positiveCallback?.();
              onClose();
            }}>
            {t('answer.yes')}
          </Button>
          <Button
            className="mr-2"
            onClick={() => {
              negativeCallback?.();
              onClose();
            }}>
            {t('answer.no')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
