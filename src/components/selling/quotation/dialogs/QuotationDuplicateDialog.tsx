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
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';
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
      <DialogContent className={cn('w-[20vw]', className)}>
        <DialogHeader className="-mb-3">
          <DialogTitle className="flex items-center gap-2">Duplication du Devis</DialogTitle>
          <DialogDescription className="flex gap-2 pt-2 items-center">
            <Info className="h-6 w-6" />
            Voulez-vous vraiment dupliquer le devis N°{' '}
            <span className="font-semibold">{id || 0}</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex gap-2 mt-2">
            <Button
              onClick={() => {
                id && duplicateQuotation();
              }}>
              {t('answer.yes')}
              <Spinner size={'small'} show={isDuplicationPending} />
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
