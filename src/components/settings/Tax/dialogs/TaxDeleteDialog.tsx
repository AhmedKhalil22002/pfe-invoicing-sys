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

interface TaxDeleteDialogProps {
  className?: string;
  label?: string;
  open: boolean;
  deleteTax: () => void;
  isDeletionPending?: boolean;
  onClose: () => void;
}

export const TaxDeleteDialog: React.FC<TaxDeleteDialogProps> = ({
  className,
  label,
  open,
  deleteTax,
  isDeletionPending,
  onClose
}) => {
  const { t } = useTranslation('common');

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={className}>
        <DialogHeader className="-mb-3">
          <DialogTitle className="flex items-center gap-2">Suppression d&apos;un taxe</DialogTitle>
          <DialogDescription className="flex gap-2 pt-2 items-center">
            <Info className="h-6 w-6" />
            <span>
              Voulez-vous vraiment supprimer <span className="font-semibold">{label}</span>
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex gap-2 mt-2">
            <Button
              onClick={() => {
                deleteTax?.();
              }}>
              {t('answer.yes')}
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
