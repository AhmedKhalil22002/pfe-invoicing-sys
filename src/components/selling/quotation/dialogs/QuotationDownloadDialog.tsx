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
import { SimpleCard } from '@/components/ui/simple-card';
import { Label } from '@/components/ui/label';
import { File } from 'lucide-react';
interface QuotationDownloadDialogProps {
  className?: string;
  id?: number;
  open: boolean;
  downloadQuotation: (template: string) => void;
  isDownloadingPending?: boolean;
  onClose: () => void;
}

export const QuotationDownloadDialog: React.FC<QuotationDownloadDialogProps> = ({
  className,
  id,
  open,
  downloadQuotation,
  isDownloadingPending,
  onClose
}) => {
  const { t } = useTranslation('common');

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>Telechargement</DialogTitle>
          <DialogDescription className="pt-2">
            Vous pouvez choisir le modèle que vous souhaitez
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div
            className="flex gap-2 items-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-500 rounded-lg p-4"
            onClick={() => downloadQuotation('template1')}>
            <File />
            <Label>Template 1</Label>
            <Spinner className="ml-2" size={'small'} show={isDownloadingPending} />
          </div>

          <div
            className="flex gap-2 items-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-500 rounded-lg p-4"
            onClick={() => downloadQuotation('template2')}>
            <File />
            <Label className="cursor-pointer">Template 2</Label>
            <Spinner className="ml-2" size={'small'} show={isDownloadingPending} />
          </div>

          <div
            className="flex gap-2 items-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-500 rounded-lg p-4"
            onClick={() => downloadQuotation('template3')}>
            <File />
            <Label className="cursor-pointer">Template 3</Label>
            <Spinner className="ml-2" size={'small'} show={isDownloadingPending} />
          </div>
        </div>
        <div className="mt-2"></div>
      </DialogContent>
    </Dialog>
  );
};
