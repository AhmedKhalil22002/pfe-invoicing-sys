import React from 'react';
import { Quotation, api } from '@/api';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { getErrorMessage } from '@/utils/errors';
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
interface QuotationDuplicateDialogProps {
  className?: string;
  id?: number;
  open: boolean;
  duplicateQuotation: () => void;
  isDuplicationPending?: boolean;
  onClose: () => void;
}

export const QuotationDuplicateDialog: React.FC<QuotationDuplicateDialogProps> = ({
  className,
  id,
  open,
  duplicateQuotation,
  isDuplicationPending,
  onClose
}) => {
  const { t } = useTranslation('common');

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>Duplication du Devis</DialogTitle>
          <DialogDescription className="pt-2">
            Voulez-vous vraiment dupliquer le devis N°{' '}
            <span className="font-semibold">{id || 0}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2">
          <Button
            className="mr-2"
            onClick={() => {
              id && duplicateQuotation();
              onClose();
            }}>
            {t('answer.yes')}
            <Spinner className="ml-2" size={'small'} show={isDuplicationPending} />
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
