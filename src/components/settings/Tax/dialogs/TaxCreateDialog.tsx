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
import { TaxForm } from '../TaxForm';
import { cn } from '@/lib/utils';

interface TaxCreateDialogProps {
  className?: string;
  id?: number;
  open: boolean;
  createTax: () => void;
  isCreatePending?: boolean;
  onClose: () => void;
}

export const TaxCreateDialog: React.FC<TaxCreateDialogProps> = ({
  className,
  open,
  createTax,
  isCreatePending,
  onClose
}) => {
  const { t } = useTranslation('common');
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn('w-[25vw]', className)}>
        <DialogHeader className="-mb-3">
          <DialogTitle className="flex items-center gap-2">Ajout d&apos;un taxe</DialogTitle>
          <DialogDescription className="flex gap-2 pt-2 items-center">
            <Info className="h-10 w-10" /> Introduisez les détails pour créer un nouveau taxe
            Assurez-vous que tous les champs obligatoires sont remplis avant d&apos;enregistrer.
          </DialogDescription>
        </DialogHeader>
        <TaxForm className="px-2" />
        <DialogFooter>
          <div className="flex gap-2 mt-2">
            <Button
              onClick={() => {
                createTax?.();
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
