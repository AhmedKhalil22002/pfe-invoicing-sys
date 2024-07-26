import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/common';
interface QuotationDeleteDialogProps {
  className?: string;
  id?: number;
  open: boolean;
  deleteQuotation: () => void;
  isDeletionPending?: boolean;
  onClose: () => void;
}

export const QuotationDeleteDialog: React.FC<QuotationDeleteDialogProps> = ({
  className,
  id,
  open,
  deleteQuotation,
  isDeletionPending,
  onClose
}) => {
  const { t } = useTranslation('common');

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>Suppression du Devis</DialogTitle>
          <DialogDescription className="pt-2">
            Voulez-vous vraiment supprimer le devis N°{' '}
            <span className="font-semibold">{id || 0}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2">
          <Button
            className="mr-2"
            onClick={() => {
              id && deleteQuotation();
              onClose();
            }}>
            {t('answer.yes')}
            <Spinner className="ml-2" size={'small'} show={isDeletionPending} />
          </Button>
          <Button
            className="mr-2"
            onClick={() => {
              onClose();
            }}>
            {t('answer.no')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
