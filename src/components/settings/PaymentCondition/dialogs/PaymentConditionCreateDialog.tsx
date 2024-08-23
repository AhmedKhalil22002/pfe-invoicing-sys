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
import { Info, Receipt } from 'lucide-react';
import { PaymentConditionForm } from '../PaymentConditionForm';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

interface PaymentConditionCreateDialogProps {
  className?: string;
  id?: number;
  open: boolean;
  createPaymentCondition: () => void;
  isCreatePending?: boolean;
  onClose: () => void;
}

export const PaymentConditionCreateDialog: React.FC<PaymentConditionCreateDialogProps> = ({
  className,
  open,
  createPaymentCondition,
  isCreatePending,
  onClose
}) => {
  const { t } = useTranslation('common');
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn('w-[25vw]', className)}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt />
            <Label className="font-semibold">Nouvelle Condition de paiement </Label>
          </DialogTitle>
          <DialogDescription className="flex gap-2 py-4 items-center px-2">
            <Info className="h-10 w-10" />
            <Label className="leading-5">
              Introduisez les détails pour créer une nouvelle condition de paiement. Assurez-vous
              que tous les champs obligatoires sont remplis avant
            </Label>
          </DialogDescription>
        </DialogHeader>
        <PaymentConditionForm className="gap-2 px-3 pb-2" />
        <DialogFooter className="border-t pt-5">
          <div className="flex gap-2 mt-2">
            <Button
              onClick={() => {
                createPaymentCondition?.();
              }}>
              {t('commands.save')}
              <Spinner show={isCreatePending} />
            </Button>
            <Button
              variant={'secondary'}
              onClick={() => {
                onClose();
              }}>
              {t('commands.cancel')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
