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
import { BankAccountForm } from '../BankAccountForm';
import { Info } from 'lucide-react';

interface BankAccountUpdateDialogProps {
  className?: string;
  open: boolean;
  updateBankAccount: () => void;
  isUpdatePending?: boolean;
  onClose: () => void;
}

export const BankAccountUpdateDialog: React.FC<BankAccountUpdateDialogProps> = ({
  className,
  open,
  updateBankAccount,
  isUpdatePending,
  onClose
}) => {
  const { t } = useTranslation('common');
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={className}>
        <DialogHeader className="-mb-3">
          <DialogTitle className="flex items-center gap-2">
            Mise à jour d&apos;un compte Bancaire
          </DialogTitle>
          <DialogDescription className="flex gap-2 pt-2 items-center">
            <Info className="h-10 w-10" /> Vous pouvez ici mettre à jour les détails du compte
            bancaire sélectionnée. Assurez-vous de vérifier vos modifications avant de les
            enregistrer.
          </DialogDescription>
        </DialogHeader>
        <BankAccountForm className="px-2" />
        <DialogFooter>
          <div className="flex gap-2 mt-2">
            <Button
              onClick={() => {
                updateBankAccount?.();
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
