import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Spinner } from '@/components/common';
import { Label } from '@/components/ui/label';
import { File } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/api';
import { toast } from 'react-toastify';
import { getErrorMessage } from '@/utils/errors';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/other/useMediaQuery';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer';

interface QuotationDownloadDialogProps {
  className?: string;
  id: number;
  open: boolean;
  onClose: () => void;
}

export const QuotationDownloadDialog: React.FC<QuotationDownloadDialogProps> = ({
  className,
  id,
  open,
  onClose
}) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tInvoicing } = useTranslation('invoicing');
  const isDesktop = useMediaQuery('(min-width: 1500px)');

  const { mutate: downloadQuotation, isPending: isDownloadPending } = useMutation({
    mutationFn: (template: string) => api.quotation.download(id, template),
    onSuccess: () => {
      toast.success(tInvoicing('quotation.action_download_success'), { position: 'bottom-right' });
      onClose();
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('invoicing', error, tInvoicing('quotation.action_download_failure')),
        {
          position: 'bottom-right'
        }
      );
    }
  });

  const body = (
    <div className={cn(className, 'grid grid-cols-2 gap-4')}>
      <div
        className="flex gap-2 items-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-500 rounded-lg p-4"
        onClick={() => downloadQuotation('template1')}>
        <File />
        <Label>Template 1</Label>
        <Spinner className="ml-2" size={'small'} show={isDownloadPending} />
      </div>

      <div
        className="flex gap-2 items-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-500 rounded-lg p-4"
        onClick={() => downloadQuotation('template2')}>
        <File />
        <Label className="cursor-pointer">Template 2</Label>
        <Spinner className="ml-2" size={'small'} show={isDownloadPending} />
      </div>

      <div
        className="flex gap-2 items-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-500 rounded-lg p-4"
        onClick={() => downloadQuotation('template3')}>
        <File />
        <Label className="cursor-pointer">Template 3</Label>
        <Spinner className="ml-2" size={'small'} show={isDownloadPending} />
      </div>
    </div>
  );

  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className={cn('max-w-[25vw] p-8', className)}>
          <DialogHeader>
            <DialogTitle>Telechargement</DialogTitle>
            <DialogDescription>Vous pouvez choisir le modèle que vous souhaitez</DialogDescription>
          </DialogHeader>
          <div>{body}</div>
        </DialogContent>
      </Dialog>
    );

  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Telechargement</DrawerTitle>
          <DrawerDescription>Vous pouvez choisir le modèle que vous souhaitez</DrawerDescription>
        </DrawerHeader>
        <div>{body}</div>
        <DrawerFooter className="pt-2">
          <Button variant="outline" onClick={onClose}>
            {tCommon('commands.cancel')}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
