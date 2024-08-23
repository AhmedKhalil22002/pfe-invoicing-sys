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
import { Info, WalletCards } from 'lucide-react';
import { TaxForm } from '../TaxForm';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

interface TaxUpdateDialogProps {
  className?: string;
  id?: number;
  open: boolean;
  updateTax: () => void;
  isUpdatePending?: boolean;
  onClose: () => void;
}

export const TaxUpdateDialog: React.FC<TaxUpdateDialogProps> = ({
  className,
  open,
  updateTax,
  isUpdatePending,
  onClose
}) => {
  const { t } = useTranslation('common');
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn('w-[25vw]', className)}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <WalletCards />
            <Label className="font-semibold">Mise à jour d&apos;un taxe</Label>
          </DialogTitle>
          <DialogDescription className="flex gap-2 py-4 items-center px-2">
            <Info className="h-10 w-10" />
            <Label className="leading-5">
              Vous pouvez ici mettre à jour les détails du taxe sélectionnée. Assurez-vous de
              vérifier vos modifications avant de les enregistrer.
            </Label>
          </DialogDescription>
        </DialogHeader>
        <TaxForm className="gap-2 px-3" />
        <DialogFooter className="border-t pt-5">
          <div className="flex gap-2 mt-2">
            <Button
              onClick={() => {
                updateTax?.();
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
