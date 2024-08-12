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
import { Info } from 'lucide-react';
import { PaymentConditionForm } from '../PaymentConditionForm';

interface PaymentConditionUpdateDialogProps {
  className?: string;
  id?: number;
  open: boolean;
  updatePaymentCondition: () => void;
  isUpdatePending?: boolean;
  onClose: () => void;
}

export const PaymentConditionUpdateDialog: React.FC<PaymentConditionUpdateDialogProps> = ({
  className,
  open,
  updatePaymentCondition,
  isUpdatePending,
  onClose
}) => {
  const { t } = useTranslation('common');
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={className}>
        <DialogHeader className="-mb-3">
          <DialogTitle className="flex items-center gap-2">
            Mise à jour d&apos;une condition de paiement
          </DialogTitle>
          <DialogDescription className="flex gap-2 pt-2 items-center">
            <Info className="h-10 w-10" /> Vous pouvez ici mettre à jour les détails de la condition
            de paiement sélectionnée. Assurez-vous de vérifier vos modifications avant de les
            enregistrer.
          </DialogDescription>
        </DialogHeader>
        <PaymentConditionForm className="px-2" />
        <DialogFooter>
          <div className="flex gap-2 mt-2">
            <Button
              onClick={() => {
                updatePaymentCondition?.();
              }}>
              {t('commands.save')}
              <Spinner show={isUpdatePending} />
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
