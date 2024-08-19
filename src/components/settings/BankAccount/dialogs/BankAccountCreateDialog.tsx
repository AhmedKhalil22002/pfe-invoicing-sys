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
import { cn } from '@/lib/utils';

interface BankAccountCreateDialogProps {
  className?: string;
  open: boolean;
  createBankAccount: () => void;
  isCreatePending?: boolean;
  onClose: () => void;
}

export const BankAccountCreateDialog: React.FC<BankAccountCreateDialogProps> = ({
  className,
  open,
  createBankAccount,
  isCreatePending,
  onClose
}) => {
  const { t } = useTranslation('common');
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn('w-50', className)}>
        <DialogHeader className="-mb-3">
          <DialogTitle className="flex items-center gap-2">Ajout d&apos;une activité</DialogTitle>
          <DialogDescription className="flex gap-2 py-8 items-center">
            <Info className="h-10 w-10" /> Introduisez les détails pour créer une nouveau compte
            bancaire. Assurez-vous que tous les champs obligatoires sont remplis avant
            d&apos;enregistrer.
          </DialogDescription>
        </DialogHeader>
        <BankAccountForm className="gap-4 pt-2 px-7 pb-10" />
        <DialogFooter>
          <div className="flex gap-2 mt-2">
            <Button
              onClick={() => {
                createBankAccount?.();
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
