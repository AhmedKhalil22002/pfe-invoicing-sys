import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/common';
import { Info, Receipt, ReceiptCent } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

interface PaymentConditionDeleteDialogProps {
  className?: string;
  label?: string;
  open: boolean;
  deletePaymentCondition: () => void;
  isDeletionPending?: boolean;
  onClose: () => void;
}

export const PaymentConditionDeleteDialog: React.FC<PaymentConditionDeleteDialogProps> = ({
  className,
  label,
  open,
  deletePaymentCondition,
  isDeletionPending,
  onClose
}) => {
  const { t } = useTranslation('common');

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn('w-[30vw]', className)}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt />
            <Label className="font-semibold">Suppression d&apos;une Condition de paiement</Label>
          </DialogTitle>
          <DialogDescription className="flex gap-2 pt-5 items-center px-2">
            <Info className="h-6 w-6" />
            <Label className="leading-5">
              Voulez-vous vraiment supprimer <span className="font-semibold">{label}</span>
            </Label>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="border-t pt-2">
          <div className="flex gap-2 mt-2">
            <Button
              onClick={() => {
                deletePaymentCondition?.();
              }}>
              {t('answer.yes')} , {t('commands.delete')}
              <Spinner show={isDeletionPending} />
            </Button>
            <Button
              variant={'secondary'}
              onClick={() => {
                onClose();
              }}>
              {t('answer.no')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
